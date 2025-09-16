"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Mail } from "lucide-react";
import { EnvelopeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import DataTable from "../components/Datatables/DataTable";
import { useApi } from "@/lib/hooks/api-hooks";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { InvitationCard, InvitationStatus } from "@prisma/client";
import { render } from "ejs";
export function AdminDashboard() {
  const { useApiQuery, api, useApiPost, queryClient } = useApi();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [invitations, setInvitations] = React.useState<InvitationCard[]>([]);
  const { data, isLoading } = useApiQuery<InvitationCard[]>(
    ["invitations"],
    "/admin/invitations"
  );
  const [loadingButton, setLoadingButton] = React.useState<number | null>(null);
  const { mutateAsync: generateInvitation, isPending: isGeneratingInvitation } =
    useApiPost(["generate-invitation"], "/admin/generate-invitation");
  // generate all invitations
  const {
    mutateAsync: generateAllInvitations,
    isPending: isGeneratingAllInvitations,
  } = useApiPost(
    ["generate-all-invitations"],
    "/admin/generate-all-invitations"
  );
  interface Statis {
    totalIn: number;
    generated: number;
    pending: number;
    approved: number;
  }

  const { data: statist } = useApiQuery<Statis>(["stats"], "/admin/stats");
  useEffect(() => {
    if (data) {
      setInvitations(data);
    }
  }, [data]);
  const stats = [
    {
      title: "Total Invitaions",
      value: statist?.totalIn || 0,
      icon: EnvelopeIcon,
      color: "bg-blue-500",
    },
    { title: "Generated", value: statist?.generated || 0, icon: Clock, color: "bg-green-500" },
    {
      title: "Pending",
      value: statist?.pending || 0,
      icon: Mail,
      color: "bg-orange-500",
    },
    { title: "Approved", value: statist?.approved || 0, icon: Clock, color: "bg-green-500" },
  ];
  const columns = [
    {
      header: "Name",
      accessor: "fullName",
      sortable: true,
      render: (value: string) => value || "-",
    },
    {
      header: "Position",
      accessor: "position",
      sortable: true,
      render: (value: string) => value || "-"
    },
    {
      header: "Email",
      accessor: "email",
      render: (value: string) => value || "-",
    },
    {
      header: "Phone",
      accessor: "phonNumber",
      render: (value: string) => value || "-",
    },
    {
      header: "Action",
      accessor: "status",
      render: (status: InvitationStatus, row: InvitationCard) => (
        status !== "GENERATED" ? (
          <Button
          key={row.id}
          onClick={async () => {
            if (!isGeneratingInvitation || !isGeneratingAllInvitations) {
              setLoadingButton(row.id);
              await generateInvitation({id: row.id});
              queryClient.invalidateQueries({queryKey: ["invitations"]});
              setLoadingButton(null);
            }
          }}
          variant="default"
          size={"sm"}
          className="flex-1 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            (isGeneratingInvitation && loadingButton === row.id) ||
            isGeneratingAllInvitations
          }
        >
          {isGeneratingInvitation && loadingButton === row.id ? (
            <>
              <LoadingSpinner size="sm" /> Generating
            </>
          ) : (
            <>
              <Mail className="mr-2 h-1" /> Generate
            </>
          )}
        </Button>
        ) : (
          <span className="text-gray-500">Generated</span>
        )
        
      ),
    },
  ];

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // use debounce to delay the search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const keyword = e.target.value;
      if (keyword.trim()) {
        api
          .get(`/admin/invitations?search=${searchTerm}`)
          .then((res) => {
            setInvitations(res as InvitationCard[]);
          })
          .catch((e) => {
            toast.error(e.message);
          });
      } else {
        setInvitations(data as InvitationCard[]);
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const customFilter = (
    <div className="flex items-center gap-2">
      <div className="relative flex-grow max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className={`h-5 w-5 text-gray-400`} />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                      text-sm
                    `}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="relative">
        <Button
          onClick={async () => {
            await generateAllInvitations({});
          }}
          size={"sm"}
          variant={"outline"}
          disabled={isGeneratingAllInvitations}
          className="inline-flex h-10 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingAllInvitations ? (
            <>
              <LoadingSpinner size="sm" /> Generating
            </>
          ) : (
            <>
              <Mail /> Generate All
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Stats Grid - horizontal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-base text-gray-600">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Button className="flex-1 h-13 bg-blue-600 hover:bg-blue-700 text-sm cursor-pointer">
            <Plus className="mr-2 h-3 w-3" /> Add New Employee
          </Button>
          <Button variant="outline" className="flex-1 h-13 text-sm cursor-pointer">
            <Users className="mr-2 h-3 w-3" /> View All Employees
          </Button>
           

            <Button variant="outline" className="flex-1 h-13 text-sm cursor-pointer">
            <Clock className="mr-2 h-3 w-3" /> Attendance Reports
          </Button>
          </div> */}

      {/* Recent Activity */}
      {/* <Card className="border-0 shadow-sm mb-10">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <DataTable
          columns={columns}
          data={(data as { students: unknown[] }).students as unknown[]}
          />
        </Card> */}

      {/* Invitations */}
      <Card className="border-0 shadow-sm mb-10">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Invitations</CardTitle>
        </CardHeader>
        <DataTable
          isLoading={isLoading}
          searchable={false}
          showDefaultFilters={false}
          customFilter={customFilter}
          columns={columns}
          exportable={false}
          data={invitations}
        />
      </Card>
    </>
  );
}
