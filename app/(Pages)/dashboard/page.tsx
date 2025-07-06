//

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Search,
  Filter,
  Calendar,
  User,
  CreditCard,
  Send,
  AlertCircle,
  Clock,
  Eye,
  BarChart3,
} from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const [selectedMail, setSelectedMail] = useState<UserMailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (mail: UserMailData) => {
    setSelectedMail(mail);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMail(null);
  };

  useEffect(() => {
    if (loggedIn) {
      const fetchUserAndMails = async () => {
        setIsLoading(true);
        try {
          const profile = await getUserProfile();
          if (profile) {
            setUserProfile(profile);
            const res: UserMailResponse = await getUserMails(profile.id);
            setUserMails(res);
            setFilteredMails(res);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserAndMails();
    }
  }, [loggedIn]);

  useEffect(() => {
    let result = userMails;

    if (searchTerm) {
      result = result.filter(
        (mail) =>
          mail.to_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mail.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((mail) => mail.status === statusFilter);
    }

    setFilteredMails(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, userMails]);

  // Calculate stats
  const stats = {
    total: userMails.length,
    sent: userMails.filter((mail) => mail.status === "send").length,
    failed: userMails.filter((mail) => mail.status === "failed").length,
    scheduled: userMails.filter((mail) => mail.status === "scheduled").length,
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredMails.length / itemsPerPage);
  const paginatedMails = filteredMails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "send":
        return <Send className="h-4 w-4" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      case "scheduled":
        return <Clock className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "send":
        return "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400";
      case "failed":
        return "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400";
      case "scheduled":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400";
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-6 p-8 animate-fade-in">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-xl animate-pulse">
            <Mail className="h-12 w-12 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Access Denied
            </h1>
            <p className="text-lg text-muted-foreground">
              You must be logged in to view this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-6 p-8">
          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-muted-foreground">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-muted/20">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center space-y-4 animate-slide-down">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Mail className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-primary-foreground">
                Mail Assist
              </h1>
            </div>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Welcome back! Monitor your email campaigns and track your success.
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-12">
        {/* User Profile Card */}
        {userProfile && (
          <Card className="mb-8 shadow-xl border-0 bg-card/80 backdrop-blur-sm animate-slide-up">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>

                  <div className="flex-1">
                    <CardTitle className="text-2xl text-foreground">
                      Welcome, {userProfile.username}!
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Manage your email campaigns efficiently
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-md">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-semibold">
                        {userProfile.credits} Credits
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            {
              title: "Total Emails",
              value: stats.total,
              icon: BarChart3,
              color: "from-primary to-primary/80",
            },
            {
              title: "Successfully Sent",
              value: stats.sent,
              icon: Send,
              color: "from-green-500 to-green-600",
            },
            {
              title: "Failed",
              value: stats.failed,
              icon: AlertCircle,
              color: "from-red-500 to-red-600",
            },
            {
              title: "Scheduled",
              value: stats.scheduled,
              icon: Clock,
              color: "from-yellow-500 to-yellow-600",
            },
          ].map((stat, index) => (
            <Card
              key={stat.title}
              className={`group hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm animate-slide-up shadow-md`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Email Management Section */}
        <Card
          className="shadow-xl border-0 bg-card/80 backdrop-blur-sm animate-slide-up"
          style={{ animationDelay: "400ms" }}
        >
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl text-foreground">
                    Email Campaign History
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Track and manage your sent emails
                  </p>
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search emails or subjects..."
                    className="pl-10 w-full sm:w-64 bg-card/50 border-border focus:ring-2 focus:ring-primary text-foreground"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground pointer-events-none " />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40 pl-10 bg-card/50 border-border text-foreground">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="send">Sent</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filteredMails.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 border-border">
                        <TableHead className="font-semibold text-foreground">
                          #
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          Recipient
                        </TableHead>
                        <TableHead className="hidden sm:table-cell font-semibold text-foreground">
                          Subject
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          Status
                        </TableHead>
                        <TableHead className="hidden lg:table-cell font-semibold text-foreground">
                          Sent Time
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedMails.map((mail, index) => (
                        <TableRow
                          key={mail.id}
                          className="group hover:bg-muted/30 transition-colors duration-200 border-border"
                        >
                          <TableCell className="font-medium text-muted-foreground">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold">
                                {mail.to_email?.charAt(0).toUpperCase() || "N"}
                              </div>
                              <span className="truncate text-foreground font-medium">
                                {mail.to_email || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell max-w-[200px]">
                            <span className="text-muted-foreground whitespace-normal break-words">
                              {mail.subject || "No subject"}
                            </span>
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={`${getStatusColor(mail.status)} border flex items-center space-x-1 w-fit`}
                            >
                              {getStatusIcon(mail.status)}
                              <span className="capitalize">{mail.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(mail.mail_time).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openModal(mail)}
                              className="opacity-70 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10 text-foreground"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-border bg-muted/20">
                    <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredMails.length
                      )}{" "}
                      of {filteredMails.length} emails
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="hover:bg-primary/10 text-foreground"
                      >
                        Previous
                      </Button>
                      <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-md">
                        {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="hover:bg-primary/10 text-foreground"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Mail className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    No emails found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Start sending emails to see them appear here"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Email Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
  <DialogContent
    className="w-[95vw] max-w-4xl h-[85vh] flex flex-col bg-card border border-border overflow-hidden"
  >
    {/* Header */}
    <DialogHeader className="border-b border-border pb-4">
      <DialogTitle className="flex items-center space-x-3 text-foreground">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
          <Mail className="h-4 w-4 text-primary-foreground" />
        </div>
       <div className="flex flex-col">
  <span className="text-base font-semibold text-foreground">
    Email Preview
  </span>
  <p className="text-sm font-normal text-muted-foreground mt-1 break-words max-w-xs sm:max-w-sm md:max-w-md">
    {selectedMail?.subject || "No subject"}
  </p>
</div>

      </DialogTitle>
    </DialogHeader>

    {/* Body (scrollable) */}
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-foreground">
      {selectedMail && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/30 rounded-lg p-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              To
            </label>
            <p className="text-sm text-foreground mt-1 break-words">
              {selectedMail.to_email}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Status
            </label>
            <div className="mt-1">
              <Badge
                className={`${getStatusColor(
                  selectedMail.status
                )} border flex items-center space-x-1 w-fit`}
              >
                {getStatusIcon(selectedMail.status)}
                <span className="capitalize">{selectedMail.status}</span>
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Sent
            </label>
            <p className="text-sm text-foreground mt-1">
              {new Date(selectedMail.mail_time).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* HTML email body preview */}
      {selectedMail?.html ? (
        <div className="overflow-y-auto max-h-[50vh] border border-border rounded-lg p-4 bg-card">
          <div
            className="prose prose-sm max-w-none dark:prose-invert break-words"
            dangerouslySetInnerHTML={{ __html: selectedMail.html }}
          />
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No email content available to preview.</p>
        </div>
      )}
    </div>

    {/* Footer (fixed at bottom) */}
    <DialogFooter className="border-t border-border pt-4">
      <Button
        onClick={closeModal}
        variant="outline"
        className="hover:bg-muted"
      >
        Close Preview
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
