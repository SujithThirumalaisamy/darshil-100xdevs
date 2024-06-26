"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createLab, endLab, getStackStatus } from "@/app/actions";
import { Input } from "./input";
import { Label } from "./label";
import { Oval } from "react-loader-spinner";

export default function LabContolCard() {
  const [publicSSHKey, setPublicSSHKey] = useState<string>("");
  const [EC2InstanceIP, setEC2InstanceIP] = useState<string>("");
  const [S3BucketName, setS3BucketName] = useState<string>("");
  const [TempUserAccessKeyId, setTempUserAccessKeyId] = useState<string>("");
  const [TempUserSecretAccessKey, setTempUserSecretAccessKey] =
    useState<string>("");
  const [isLabCreated, setIsLabCreated] = useState(false);
  const [isProvisioning, setisProvisioning] = useState(false);
  const userName = "test-user";

  let timeOut: ReturnType<typeof setTimeout> | null = null;
  const handleCreateLab = async (userName: string, publicSSHKey: string) => {
    await createLab(userName, publicSSHKey);
    setisProvisioning(true);
    timeOut = setTimeout(fetchOutput, 3000);
  };
  function fetchOutput() {
    setTimeout(() => {
      getStackStatus(`user-${userName}-stack`)
        .then(
          (
            res:
              | null
              | undefined
              | {
                  EC2InstanceIP: string;
                  S3BucketName: string;
                  TempUserAccessKeyId: string;
                  TempUserSecretAccessKey: string;
                }
          ) => {
            if (res === null || res === undefined) {
              timeOut = setTimeout(fetchOutput, 3000);
            } else {
              console.log(res);
              setisProvisioning(false);
              setIsLabCreated(true);
              setEC2InstanceIP(res.EC2InstanceIP);
              setS3BucketName(res.S3BucketName);
              setTempUserAccessKeyId(res.TempUserAccessKeyId);
              setTempUserSecretAccessKey(res.TempUserSecretAccessKey);
              if (timeOut) clearTimeout(timeOut);
            }
          }
        )
        .catch((e) => {
          if (timeOut) clearTimeout(timeOut);
        });
    }, 3000);
  }
  return (
    <Card
      className="fixed"
      style={{
        top: "50%",
        right: 50,
        transform: "translate(-50%,-50%)",
      }}
    >
      <CardHeader>
        <CardTitle>Learn EC2 and S3 now!</CardTitle>
      </CardHeader>
      {isProvisioning ? (
        <CardContent className="flex flex-col align-middle justify-center w-full h-full">
          <Oval
            visible={true}
            height="40"
            width="40"
            color="#fff"
            secondaryColor="grey"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </CardContent>
      ) : isLabCreated ? (
        <CardContent className="flex flex-col align-middle justify-center">
          <Label>EC2InstanceIP</Label>
          <span style={{ display: "block", fontWeight: "thin" }}>
            {EC2InstanceIP}
          </span>
          <Label>S3BucketName</Label>
          <span style={{ display: "block", fontWeight: "thin" }}>
            {S3BucketName}
          </span>
          <Label>TempUserAccessKeyId</Label>
          <span style={{ display: "block", fontWeight: "thin" }}>
            {TempUserAccessKeyId}
          </span>
          <Label>TempUserSecretAccessKey</Label>
          <span style={{ display: "block", fontWeight: "thin" }}>
            {TempUserSecretAccessKey}
          </span>
        </CardContent>
      ) : (
        <CardContent className="flex flex-col align-middle justify-center">
          <Label htmlFor="ssh-input">Public SSH Key</Label>
          <Input
            name="ssh-input"
            id="ssh-input"
            type="text"
            onChange={({ target }) => setPublicSSHKey(target.value)}
            value={publicSSHKey}
          />
        </CardContent>
      )}
      <CardFooter className="flex justify-between">
        {!isLabCreated && !isProvisioning ? (
          <Button
            variant={"default"}
            onClick={() => handleCreateLab(userName, publicSSHKey)}
          >
            Create Lab
          </Button>
        ) : (
          <Button
            variant={"outline"}
            onClick={() => {
              setisProvisioning(false);
              setIsLabCreated(false);
              setEC2InstanceIP("");
              setPublicSSHKey("");
              setS3BucketName("");
              setTempUserAccessKeyId("");
              setTempUserSecretAccessKey("");
              endLab(userName, publicSSHKey);
            }}
          >
            End Lab
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
