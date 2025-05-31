"use client";

import { useUser } from "@/context/UserContext";
import { getUserMails, getUserProfile } from "@/utils/auth";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface UserProfile {
  id: string;
  username: string;
  credits: number;
}

export interface UserMailData {
  id: string;
  user_id: string;
  mail_id: string;
  mail_time: string; // ISO 8601 timestamp
  status: "send" | "failed" | "scheduled" | string;
  to_email: string | null;
  subject: string | null;
  html: string | null;
}

export type UserMailResponse = UserMailData[];

export default function Dashboard() {
  const { loggedIn } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [userMails, setUserMails] = useState<UserMailResponse>([]);
  const [filteredMails, setFilteredMails] = useState<UserMailResponse>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Inside component function (after useState declarations)
  const [selectedMail, setSelectedMail] = useState<UserMailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open modal
  const openModal = (mail: UserMailData) => {
    setSelectedMail(mail);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMail(null);
  };

  useEffect(() => {
    if (loggedIn) {
      const fetchUserAndMails = async () => {
        const profile = await getUserProfile();

        if (profile) {
          setUserProfile(profile);
          // const res = await fetch("/api/user-mails", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({ user_id: profile.id }),
          // });
          // const data: UserMailResponse = await res.json();
          const res:UserMailResponse = await getUserMails(profile.id);
          setUserMails(res);
          setFilteredMails(res);
        }
      };
      fetchUserAndMails();
    }
  }, [loggedIn]);

  useEffect(() => {
    let result = userMails;

    // Apply search filter
    if (searchTerm) {
      result = result.filter((mail) =>
        mail.to_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((mail) => mail.status === statusFilter);
    }

    setFilteredMails(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, userMails]);

  // Pagination logic
  const totalPages = Math.ceil(filteredMails.length / itemsPerPage);
  const paginatedMails = filteredMails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="mt-4 text-lg">You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-4 px-2 sm:py-10 sm:px-4">
  <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Dashboard</h1>
  <p className="text-base sm:text-lg mb-4 sm:mb-6">Welcome to your dashboard!</p>

  {userProfile && (
    <div className="w-full max-w-4xl bg-background text-foreground shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">User Info</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <p className="font-medium">Username:</p>
          <p className="truncate">{userProfile.username}</p>
        </div>
        <div>
          <p className="font-medium">Credits Left:</p>
          <p>{userProfile.credits}</p>
        </div>
      </div>
    </div>
  )}

  <div className="w-full max-w-4xl bg-background text-foreground shadow-md rounded-lg p-4 sm:p-6 border">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
      <h2 className="text-xl sm:text-2xl font-semibold">Sent Emails</h2>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Input
          placeholder="Search emails..."
          className="w-full sm:w-48"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white text-white dark:bg-black dark:text-white">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="send">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    {filteredMails.length > 0 ? (
      <>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>To</TableHead>
                <TableHead className="hidden xs:table-cell">Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMails.map((mail, index) => (
                <TableRow key={mail.id}>
                  <TableCell className="font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="max-w-[100px] truncate">
                    {mail.to_email ? (
                      <button
                        className="text-blue-600 hover:underline dark:text-blue-400"
                        onClick={() => openModal(mail)}
                      >
                        {mail.to_email}
                      </button>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell className="hidden xs:table-cell max-w-[150px] truncate">
                    {mail.subject || "N/A"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        mail.status === "send"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : mail.status === "failed"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {mail.status}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {new Date(mail.mail_time).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 py-4">
            <div className="text-sm sm:order-2">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2 sm:order-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </>
    ) : (
      <p className="text-center py-6">
        No emails found matching your criteria.
      </p>
    )}
  </div>
  
  <Dialog open={isModalOpen} onOpenChange={closeModal}>
    <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-3xl bg-white text-white dark:bg-black dark:text-white"> 
      <DialogHeader>
        <DialogTitle>Email Preview</DialogTitle>
      </DialogHeader>
      {selectedMail?.html ? (
        <div className="overflow-y-auto max-h-[60vh] border rounded-md p-2 sm:p-4 bg-muted text-foreground">
          <div dangerouslySetInnerHTML={{ __html: selectedMail.html }} />
        </div>
      ) : (
        <p>No email body available.</p>
      )}
      <DialogFooter>
        <Button onClick={closeModal} variant="outline">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
  );
}
