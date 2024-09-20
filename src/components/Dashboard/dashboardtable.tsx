import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Folder,
  Home,
  LineChart,
  ListFilter,
  LucideHardDrive,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { StorageStats } from "./storagestats";

export function DashboardTable() {
  return (
    <Card x-chunk="dashboard-05-chunk-3">
      <CardHeader className="px-7">
        <CardTitle>Recent Files</CardTitle>
        {/* <CardDescription>
                  Recent orders from your store.
                </CardDescription> */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">members</TableHead>
              <TableHead className="hidden sm:table-cell">
                last modified
              </TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-accent">
              <TableCell>
                <div className="font-medium">Liam Johnson</div>
                {/* <div className="hidden text-sm text-muted-foreground md:inline">
                          liam@example.com
                        </div> */}
              </TableCell>
              <TableCell className="hidden sm:table-cell">Sale</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Fulfilled
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-06-23</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Olivia Smith</div>
                {/* <div className="hidden text-sm text-muted-foreground md:inline">
                          olivia@example.com
                        </div> */}
              </TableCell>
              <TableCell className="hidden sm:table-cell">Refund</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="outline">
                  Declined
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-06-24</TableCell>
              <TableCell className="text-right">$150.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Noah Williams</div>
                {/* <div className="hidden text-sm text-muted-foreground md:inline">
                          noah@example.com
                        </div> */}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                Subscription
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Fulfilled
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-06-25</TableCell>
              <TableCell className="text-right">$350.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Emma Brown</div>
                {/* <div className="hidden text-sm text-muted-foreground md:inline">
                          emma@example.com
                        </div> */}
              </TableCell>
              <TableCell className="hidden sm:table-cell">Sale</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Fulfilled
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-06-26</TableCell>
              <TableCell className="text-right">$450.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Liam Johnson</div>
                {/* <div className="hidden text-sm text-muted-foreground md:inline">
                          liam@example.com
                        </div> */}
              </TableCell>
              <TableCell className="hidden sm:table-cell">Sale</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Fulfilled
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-06-23</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Liam Johnson</div>
                {/* <div className="hidden text-sm text-muted-foreground md:inline">
                          liam@example.com
                        </div> */}
              </TableCell>
              <TableCell className="hidden sm:table-cell">Sale</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Fulfilled
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-06-23</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Olivia Smith</div>
                {/* <div className="hidden text-sm text-muted-foreground md:inline">
                          olivia@example.com
                        </div> */}
              </TableCell>
              <TableCell className="hidden sm:table-cell">Refund</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="outline">
                  Declined
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-06-24</TableCell>
              <TableCell className="text-right">$150.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Emma Brown</div>
                {/* <div className="hidden text-sm text-muted-foreground md:inline">
                          emma@example.com
                        </div> */}
              </TableCell>
              <TableCell className="hidden sm:table-cell">Sale</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Fulfilled
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-06-26</TableCell>
              <TableCell className="text-right">$450.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
