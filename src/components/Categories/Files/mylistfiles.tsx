// import { TablePaginationComponent } from "@/components/Core/TablePagination";
// import TanStackTable from "@/components/Core/TanstackTable";
import { FilesTableColumns } from "@/components/Dashboard/FilesTableColoumns";
import PaginationComponent from "@/components/PaginationComponent";
import TanStackTableComponent from "@/components/TanStackTableComponent";

const MyListFiles = ({
  filesData,
  loading,
  searchParams,
  getAllMyFiles,
  paginationDetails,
  getData,
}: any) => {
  // const captureRowPerItems = (value?: number) => {
  //   getAllMyFiles({
  //     ...searchParams,
  //     limit: value,
  //     page: 1,
  //   });
  // };

  // const capturePageNum = (value: string) => {
  //   getAllMyFiles({
  //     ...searchParams,
  //     limit: searchParams.limit as string,
  //     page: value,
  //   });
  // };

  const handlePageChange = (newPage: number) => {
    getData({ page: newPage.toString() });
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    paginationDetails({ ...paginationDetails, limit: newLimit, page: 1 }); // Reset page to 1
    getData({ limit: newLimit.toString(), page: "1" });
  };

  return (
    <div className="ml-6 mt-6 p-6  flex-grow overflow-auto max-h-[70vh]">
      <div className="overflow-x-auto">
        <TanStackTableComponent
          columns={FilesTableColumns()}
          data={filesData}
          loading={loading}
          searchParams={searchParams}
          getData={getAllMyFiles}
        />
      </div>
      <div className="mb-10 ">
        {/* <TablePaginationComponent
          captureRowPerItems={captureRowPerItems}
          capturePageNum={capturePageNum}
          paginationDetails={paginationDetails}
        /> */}

        <PaginationComponent
          page={paginationDetails.page}
          total_pages={paginationDetails.total_pages}
          total={paginationDetails.total}
          onPageChange={handlePageChange}
          itemsPerPage={paginationDetails.limit}
          onChangeItemsPerPage={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};
export default MyListFiles;
