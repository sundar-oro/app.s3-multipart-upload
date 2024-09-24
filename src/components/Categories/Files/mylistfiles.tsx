import { TablePaginationComponent } from "@/components/Core/TablePagination";
import TanStackTable from "@/components/Core/TanstackTable";
import { FilesTableColumns } from "@/components/Dashboard/FilesTableColoumns";

const MyListFiles = ({
  filesData,
  loading,
  searchParams,
  getAllMyFiles,
  paginationDetails,
}: any) => {
  const captureRowPerItems = (value?: number) => {
    getAllMyFiles({
      ...searchParams,
      limit: value,
      page: 1,
    });
  };

  const capturePageNum = (value: string) => {
    getAllMyFiles({
      ...searchParams,
      limit: searchParams.limit as string,
      page: value,
    });
  };

  return (
    <div className="ml-6 mt-6 p-6  flex-grow  max-h-[70vh]">
      <div className="overflow-x-auto">
        <TanStackTable
          columns={FilesTableColumns()}
          data={filesData}
          loading={loading}
          searchParams={searchParams}
          getData={getAllMyFiles}
        />
      </div>
      <div className="mb-10 ">
        <TablePaginationComponent
          captureRowPerItems={captureRowPerItems}
          capturePageNum={capturePageNum}
          paginationDetails={paginationDetails}
        />
      </div>
    </div>
  );
};
export default MyListFiles;
