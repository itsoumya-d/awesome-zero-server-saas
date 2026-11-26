import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateOidcTrustPolicy,
  validateLambdaConfig,
  validateStorageSecurity,
  auditServerlessEstate,
  type IamTrustPolicy,
  type LambdaConfig,
  type StorageResource,
} from '../src/guardrails.ts';

test('OIDC trust policy validator flags missing or wildcard sub claims', () => {
  const insecurePolicy: IamTrustPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'sts:AssumeRoleWithWebIdentity',
        Principal: {
          Federated: 'arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com',
        },
      },
    ],
  };

  const violations = validateOidcTrustPolicy('github-deployer', insecurePolicy);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].ruleId, 'OIDC-001');
  assert.equal(violations[0].severity, 'HIGH');
});

test('OIDC trust policy passes with strict repo sub claim', () => {
  const securePolicy: IamTrustPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: 'sts:AssumeRoleWithWebIdentity',
        Principal: {
          Federated: 'arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com',
        },
        Condition: {
          StringEquals: {
            'token.actions.githubusercontent.com:sub': 'repo:org/app:ref:refs/heads/main',
          },
        },
      },
    ],
  };

  const violations = validateOidcTrustPolicy('github-deployer', securePolicy);
  assert.equal(violations.length, 0);
});

test('Lambda validator checks arm64 architecture, timeouts, and required tags', () => {
  const invalidLambda: LambdaConfig = {
    functionName: 'api-router',
    runtime: 'nodejs20.x',
    architecture: 'x86_64',
    memorySizeMb: 512,
    timeoutSeconds: 60,
  };

  const violations = validateLambdaConfig(invalidLambda);
  const ruleIds = violations.map(v => v.ruleId);
  assert.ok(ruleIds.includes('LAMBDA-001'));
  assert.ok(ruleIds.includes('LAMBDA-002'));
  assert.ok(ruleIds.includes('TAG-001'));
});

test('Estate audit aggregates multiple resources and passes compliant setups', () => {
  const validLambda: LambdaConfig = {
    functionName: 'webhook-handler',
    runtime: 'nodejs20.x',
    architecture: 'arm64',
    memorySizeMb: 256,
    timeoutSeconds: 10,
    tags: { Environment: 'production', CostCenter: 'infra-ops' },
  };

  const validStorage: StorageResource = {
    id: 'payload-cache',
    type: 's3',
    encrypted: true,
    kmsKeyId: 'arn:aws:kms:eu-central-1:123456789012:key/abc',
  };

  const report = auditServerlessEstate([], [validLambda], [validStorage]);
  assert.equal(report.passed, true);
  assert.equal(report.violations.length, 0);
  assert.equal(report.totalResourcesAudited, 2);
});
