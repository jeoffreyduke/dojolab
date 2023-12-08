"use client";
import React from "react";
import { createRoleInvite } from "../../../../api/database";
import { useRouter, useSearchParams } from "next/navigation";

function ClassTeacher() {
  const url = "http://localhost:3000/signup/?inviteId=poVBI6yLx1x1S9xpDUBD";
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolId");
  const inviteId = searchParams.get("inviteId");

  return (
    <div>
      <div>
        <>SchoolId: {schoolId}</>
        <>InviteId: {inviteId}</>
      </div>
      <button
        onClick={() =>
          createRoleInvite(
            "jeoffreyduke@gmail.com",
            "clzWSll9zW2VUM17TKma",
            "class-teacher"
          )
        }
      >
        Click to send invite
      </button>
    </div>
  );
}

export default ClassTeacher;
