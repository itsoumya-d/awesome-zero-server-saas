export interface IamStatement {
  Effect: 'Allow' | 'Deny';
  Action: string | string[];
  Resource?: string | string[];
  Principal?: {
    Federated?: string;
    AWS?: string | string[];
  };
  Condition?: Record<string, Record<string, string | string[]>>;
}

export interface IamTrustPolicy {
  Version: string;
  Statement: IamStatement[];
}

export interface LambdaConfig {
  functionName: string;
  runtime: string;
  architecture: 'arm64' | 'x86_64';
  memorySizeMb: number;
  timeoutSeconds: number;
  environmentVariables?: Record<string, string>;
  tags?: Record<string, string>;
}

export interface StorageResource {
  id: string;
  type: 's3' | 'sqs' | 'dynamodb';
  kmsKeyId?: string;
  encrypted: boolean;
  tags?: Record<string, string>;
}

export interface GuardrailViolation {
  ruleId: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  resourceId: string;
  message: string;
}

export interface EstateAuditReport {
  timestamp: string;
  totalResourcesAudited: number;
  passed: boolean;
  violations: GuardrailViolation[];
}

export function validateOidcTrustPolicy(roleName: string, policy: IamTrustPolicy): GuardrailViolation[] {
  const violations: GuardrailViolation[] = [];
  for (const [idx, stmt] of policy.Statement.entries()) {
    if (stmt.Effect !== 'Allow') continue;
    const fed = stmt.Principal?.Federated || '';
    if (fed.includes('token.actions.githubusercontent.com')) {
      const cond = stmt.Condition || {};
      const stringEquals = cond['StringEquals'] || cond['StringLike'] || {};
      const sub = stringEquals['token.actions.githubusercontent.com:sub'];
      if (!sub) {
        violations.push({
          ruleId: 'OIDC-001',
          severity: 'HIGH',
          resourceId: `${roleName}-stmt-${idx}`,
          message: 'GitHub OIDC trust policy missing repository subject (sub) claim restriction.',
        });
      } else if (typeof sub === 'string' && sub.trim() === '*') {
        violations.push({
          ruleId: 'OIDC-002',
          severity: 'HIGH',
          resourceId: `${roleName}-stmt-${idx}`,
          message: 'GitHub OIDC trust policy must not allow wildcard sub claim (*).',
        });
      }
    }
  }
  return violations;
}

export function validateLambdaConfig(config: LambdaConfig): GuardrailViolation[] {
  const violations: GuardrailViolation[] = [];
  if (config.architecture !== 'arm64') {
    violations.push({
      ruleId: 'LAMBDA-001',
      severity: 'MEDIUM',
      resourceId: config.functionName,
      message: `Lambda architecture is ${config.architecture}; arm64 (Graviton) required for cost/perf baseline.`,
    });
  }
  if (config.timeoutSeconds > 30) {
    violations.push({
      ruleId: 'LAMBDA-002',
      severity: 'HIGH',
      resourceId: config.functionName,
      message: `Timeout ${config.timeoutSeconds}s exceeds 30s synchronous serverless threshold.`,
    });
  }
  if (config.memorySizeMb < 128 || config.memorySizeMb > 3008) {
    violations.push({
      ruleId: 'LAMBDA-003',
      severity: 'MEDIUM',
      resourceId: config.functionName,
      message: `Memory allocation ${config.memorySizeMb}MB is outside standard tier bounds (128-3008MB).`,
    });
  }
  const requiredTags = ['Environment', 'CostCenter'];
  for (const tag of requiredTags) {
    if (!config.tags || !config.tags[tag]) {
      violations.push({
        ruleId: 'TAG-001',
        severity: 'LOW',
        resourceId: config.functionName,
        message: `Missing mandatory organizational tag: ${tag}.`,
      });
    }
  }
  return violations;
}

export function validateStorageSecurity(storage: StorageResource): GuardrailViolation[] {
  const violations: GuardrailViolation[] = [];
  if (!storage.encrypted) {
    violations.push({
      ruleId: 'SEC-001',
      severity: 'HIGH',
      resourceId: storage.id,
      message: `Serverless storage asset ${storage.id} (${storage.type}) is not encrypted at rest.`,
    });
  }
  return violations;
}

export function auditServerlessEstate(
  roles: { roleName: string; policy: IamTrustPolicy }[],
  lambdas: LambdaConfig[],
  storages: StorageResource[]
): EstateAuditReport {
  const violations: GuardrailViolation[] = [];
  for (const r of roles) violations.push(...validateOidcTrustPolicy(r.roleName, r.policy));
  for (const l of lambdas) violations.push(...validateLambdaConfig(l));
  for (const s of storages) violations.push(...validateStorageSecurity(s));

  return {
    timestamp: new Date().toISOString(),
    totalResourcesAudited: roles.length + lambdas.length + storages.length,
    passed: violations.filter(v => v.severity === 'HIGH').length === 0,
    violations,
  };
}
