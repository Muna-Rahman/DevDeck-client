import { redirect } from "next/navigation";

export default function DashboardRootCatchAll() {
  redirect("/cards");
}