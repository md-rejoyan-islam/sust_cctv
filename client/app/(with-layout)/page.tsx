import Homepage from "@/components/homepage";

export const metadata = {
  title: "Home",
  description: "Monitor your campus security system",
};

const Page = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Home</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your campus security system
        </p>
      </div>
      <Homepage />
    </div>
  );
};

export default Page;
