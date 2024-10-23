
interface PaginationPropes{
    page:number;
    setPage:(value:number)=> void;
    totalData:number;
    limit:number;
}
const Pagination:React.FC<PaginationPropes> = ({page, setPage, totalData, limit}) =>{

    const totlePages = Math.ceil(totalData/limit);

    function nextPage() {

        if(totlePages === page){
            setPage(page=0)
        }

        setPage(page+1)
    }

    function prevPage() {
        if(page > 1){
            setPage(page-1)
        }
    }

  return (
    <div className='flex items-center justify-center h-16 gap-3 mt-5 '>
        <button onClick={prevPage} className='font-medium border-2 bg-black text-white px-3 py-1 rounded-sm hover:bg-white hover:border-2 border-black  hover:text-black'>Prev</button>
        <div className='border-2 border-black px-2 py-0.5 font-medium'>
          {page} of {totlePages}
        </div>
        <button onClick={nextPage} className='font-medium border-2 bg-black text-white px-3 py-1 rounded-sm hover:bg-white hover:text-black hover:border-2 border-black '>Next</button>
      </div>
  )
}

export default Pagination