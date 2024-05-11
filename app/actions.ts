"use server";
import {
  Capability,
  CloudFormation,
  DescribeStacksCommandOutput,
  Output,
} from "@aws-sdk/client-cloudformation";
export async function createLab(userName: string, publicKey: string) {
  const cfmClient = new CloudFormation();
  try {
    const stack = await cfmClient.createStack({
      StackName: `user-${userName}-stack`,
      Parameters: [
        {
          ParameterKey: "PublicKey",
          ParameterValue: publicKey,
        },
        {
          ParameterKey: "TempUserName",
          ParameterValue: userName,
        },
        {
          ParameterKey: "TempUserPolicyName",
          ParameterValue: userName + "-policy",
        },
      ],
      Capabilities: [Capability.CAPABILITY_NAMED_IAM],
      TemplateURL:
        "https://appcomposer-g3rlvrz6pkw5xz5r-us-east-1.s3.amazonaws.com/template-1715431401617.yaml",
    });
    return stack;
  } catch (error) {
    const stack = await cfmClient.describeStacks({
      StackName: `user-${userName}-stack`,
    });
    if (stack.Stacks) return stack.Stacks[0];

    return null;
  }
}

export async function getStackStatus(stackName: string | undefined) {
  if (stackName === undefined) return;
  const cfmClient = new CloudFormation();
  try {
    const stackOutput: DescribeStacksCommandOutput =
      await cfmClient.describeStacks({ StackName: stackName });
    if (stackOutput && stackOutput.Stacks?.length) {
      let result:
        | null
        | undefined
        | {
            EC2InstanceIP: string;
            S3BucketName: string;
            TempUserAccessKeyId: string;
            TempUserSecretAccessKey: string;
          } = null;
      stackOutput.Stacks[0].Outputs?.forEach((output: Output) => {
        if (!output.OutputKey) return;
        if (result == null) {
          result = {
            EC2InstanceIP: "",
            S3BucketName: "",
            TempUserAccessKeyId: "",
            TempUserSecretAccessKey: "",
            [output.OutputKey]: output.OutputValue,
          };
        }
        result = { ...result, [output.OutputKey]: output.OutputValue };
      });
      return result;
    }
    throw new Error("Oops Something went wrong");
  } catch (e) {
    return null;
  }
}

export async function endLab(userName: string, publicSSHKey: string) {
  const cfmClient = new CloudFormation();
  const stack = await cfmClient.deleteStack({
    StackName: `user-${userName}-stack`,
    // RetainResources: ["MyKeyPair"],
  });
  return stack;
}
