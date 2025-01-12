"use client";
import { withAuth } from "@/components/hoc/withAuth";
import {
  ChurchIcon,
  Loader,
  type LucideIcon,
  Navigation,
  Radar,
  Users,
  Wheat,
} from "lucide-react";
import Image from "next/image";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";

import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { toast } from "sonner";
import { getDashItems } from "../actions/fellowships";
import { getCellsByID } from "../actions/cells";

function Home() {
  const { me } = useAuthMemberStore();
  const role = me?.data?.member?.role;

  const cell_id: string | "" =
    me?.data?.role === "CELL_LEADER" ? me?.data.member?.cell_id : " ";

  const {
    execute: getDash,
    result: dashResult,
    status: dashStatus,
  } = useAction(getDashItems);

  useEffect(() => {
    try {
      getDash();
      getCellsByID({
        id: cell_id,
      });
    } catch (e) {
      console.error(e);
      toast.error("An Error Occured");
    }
  }, [getDash, getCellsByID]);

  const shouldShowCard = (cardType: string) => {
    if (role === "ADMIN") return true;
    switch (cardType) {
      case "zones":
        return role === "ZONE_LEADER";
      case "fellowships":
        return role === "FELLOWSHIP_LEADER" || role === "ZONE_LEADER";
      case "cells":
        return (
          role === "CELL_LEADER" ||
          role === "FELLOWSHIP_LEADER" ||
          role === "ZONE_LEADER"
        );
      case "members":
        return true;
      default:
        return false;
    }
  };

  // Dashboard card component
  const DashboardCard = ({
    title,
    icon: Icon,
    count,
    color,
  }: {
    title: string;
    icon: LucideIcon;
    count: number;
    color: string;
  }) => (
    <div
      className={`p-4 mt-10 rounded-md bg-neutral-100 shadow-lg border border-l border-gradient-to-r from-${color}-500 to-${color}-700`}
    >
      <div className="flex items-center justify-between h-[20svh]">
        <div className="flex items-center space-x-4 text-black">
          <Icon className="h-6 w-6" />
          <div>
            <h2 className="xl:text-3xl text-2xl font-bold">{title}</h2>
            {/* <Button className="bg-purple-600 text-white text-sm font-Poppins py-2 px-6">
              See All
            </Button> */}
          </div>
        </div>
        <p className="text-purple-900 font-extrabold text-6xl mx-10">{count}</p>
      </div>
      <div
        className={`border-${color}-600 mt-10 bg-gradient-to-r from-${color}-500 to-${color}-700 shadow-lg w-full h-2 rounded-full`}
      ></div>
    </div>
  );

  return (
    <>
      {me && (
        <>
          <div className="xl:mt-[-1.6rem] mt-10">
            <div className="flex flex-col">
              <div className="flex h-5 items-center space-x-4 text-sm"></div>

              {/* Notify */}
              <div className="border-2 border-purple-600 p-4 rounded-md bg-gradient-to-r from-purple-500 to-purple-700 shadow-lg">
                <div className="flex items-center justify-between h-auto py-5">
                  <div className="flex items-center space-x-4 text-purple-200">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-10">
                        {me?.data?.member?.cell?.cell_name ||
                          me?.data?.member?.zone?.zone_name ||
                          me?.data?.member?.fellowship?.fellowship_name  }
                          
                      </h2>
                    
                      <p className="font-light text-md mb-11">
                        {me?.data?.role === "ZONE_LEADER" && "Zone Leader"}
                        {me?.data?.role === "ADMIN" && "Admin"}
                        {me?.data?.role === "FELLOWSHIP_LEADER" &&
                          "Fellowship Leader"}
                        {me?.data?.role === "CELL_LEADER" && "Cell Leader"}
                      </p>
                      {/* <p className="font-light text-md mb-11">
                        {cellRes?.data.cell_name}as
                      </p> */}
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <Image
                      src="/images/menorah.png"
                      alt="Notification illustration"
                      width={200}
                      height={200}
                      className="rounded-full bg-transparent p-2"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
                    />
                  </div>
                </div>
              </div>

              {/* Data */}
              {dashStatus === "hasSucceeded" && dashResult ? (
                <>
                  {me.data.role === "MEMBER" ? (
                   <div className="flex justify-center mt-[200px] space-y-4 flex-col items-center text-lg text-neutral-600">
                     <Wheat className="text-neutral-400 mx-5 text-4xl" size={'100'}/> 
                     <p>Hang in Tight Members, Your Features are coming soon!!</p>
                   </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shouldShowCard("zones") && (
                          <DashboardCard
                            title="Zones"
                            icon={Navigation}
                            count={dashResult.data.data.zones}
                            color="yellow"
                          />
                        )}
                        {shouldShowCard("fellowships") && (
                          <DashboardCard
                            title="Fellowships"
                            icon={ChurchIcon}
                            count={dashResult.data.data.fellowships}
                            color="red"
                          />
                        )}
                        {shouldShowCard("cells") && (
                          <DashboardCard
                            title="Cells"
                            icon={Radar}
                            count={dashResult.data.data.cells}
                            color="green"
                          />
                        )}
                        {shouldShowCard("members") && (
                          <DashboardCard
                            title="Members"
                            icon={Users}
                            count={dashResult.data.data.members}
                            color="purple"
                          />
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="mt-10 flex justify-center">
                  <Loader className="animate-spin" />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default withAuth(Home);
