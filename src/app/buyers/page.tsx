import { LeadsTable } from "@/components/leads-table";

const BuyersPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">
          Property Leads Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and track your property leads with advanced filtering and
          search capabilities.
        </p>
      </div>
      <LeadsTable />
    </div>
  );
};
export default BuyersPage;
