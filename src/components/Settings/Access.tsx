"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { baseURL } from "@/config";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { Tooltip } from "@mui/material";

export default function Access() {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [workspace, setWorkspace] = useState<any>([]);
  const [singleWorkspace, setSingleWorkspace] = useState<any>();
  const [accessList, setAccessList] = useState<any>();

  useEffect(() => {
    setIsDataLoading(true);
    axios
      .get(`${baseURL}/v1/api/workspace?user_id=${"65f72cd38cfe34c5f0c2648b"}`)
      .then((response) => {
        setWorkspace(response.data);
        setIsDataLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsDataLoading(false);
      });
  }, []);

  const getAccessList = async (workspace: any) => {
    console.log("this is workspace=>", workspace);
    setSingleWorkspace(workspace);
    await axios
      .get(
        `https://snipsavvy.onrender.com/v1/api/workspace/access/${workspace._id}`
      )
      .then((response) => {
        setAccessList(response.data);
      });
  };

  interface deleteBody {
    email: string;
    workspace_id: string;
  }

  const RemoveAccess = async (e: any, access: any) => {
    e.preventDefault();
    try {
      const body: deleteBody = {
        email: access.email,
        workspace_id: access.workspace_id,
      };
      const resp = await axios.delete(
        "https://snipsavvy.onrender.com/v1/api/workspace/access",
        { data: body }
      );
      alert("Access Removed !!");
      await axios
        .get(
          `https://snipsavvy.onrender.com/v1/api/workspace/access/${singleWorkspace._id}`
        )
        .then((response) => {
          setAccessList(response.data);
        });
    } catch (error) {
      alert("error occured while reoving the access");
    }
  };

  return (
    <div className=" h-[78%]">
      <h2 className="text-2xl font-semibold mb-6">Workspace Access</h2>
      <div className="mb-10  flex h-[85%]">
        <div className="w-[30%] ml-6 overflow-auto mt-10 border-r">
          {workspace ? (
            workspace?.map((workspace: any, index: any) => (
              <div
                onClick={() => getAccessList(workspace)}
                style={{
                  background:
                    singleWorkspace?._id == workspace._id ? "black" : "",
                }}
                className="border mb-4 border-gray-500 w-[90%] p-1 hover:bg-black rounded-xl flex cursor-pointer hover:border-slate-200
          ."
              >
                <div>
                  <p className="font-bold text-5xl opacity-70"> {index + 1} </p>
                </div>
                <div className="ml-4">
                  <p className="text-xl font-semibold"> {workspace.name} </p>
                  <p className="text-md opacity-70">
                    {" "}
                    {workspace.description}{" "}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>Loading</p>
          )}
        </div>
        <div className="w-[50%] ml-10">
          <p className="text-xl"> {singleWorkspace?.name} Access Controls</p>

          <div className="mt-8 overflow-auto">
            {accessList?.map((access: any) => (
              <div className="border-b-2 border-slate-600 pb-1 flex justify-between w-[70%] mb-6">
                <p> {access.email} </p>
                <Tooltip title="Remove Access">
                  <MdDelete
                    onClick={(e) => RemoveAccess(e, access)}
                    className="cursor-pointer"
                  />
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}