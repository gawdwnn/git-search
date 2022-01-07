import styles from "@styles/Home.module.css";
import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@components/loader/loader";
import { search, searchSelector } from "../../redux";
import Pagination from "@components/pagination/Pagination";

let PageSize = 10;

export default function Home() {
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const { data, pending, error } = useSelector(searchSelector);
  const [currentPage, setCurrentPage] = useState(1);

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const handleChange = (value) => {
    if (value.length) {
      dispatch(search(value));
    }
  };

  const optimizedFn = useCallback(debounce(handleChange), []);

  // console.log({ data, pending, error });

  const loading = pending && <Loader />;

  const currentSearchData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return data?.items.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, data?.items]);

  // console.log({ currentSearchData });

  const searchList = currentSearchData.length ? (
    <ul className={styles.results}>
      {currentSearchData.map(({ id, login, avatar_url }) => (
        <Link
          href={{ pathname: "/search/[id]", query: { login } }}
          as={`/search/${id}`}
          passHref
          key={id}
        >
          <li className={styles.result}>
            <img src={avatar_url} alt={login} />
            <span>{login}</span>
          </li>
        </Link>
      ))}
    </ul>
  ) : (
    <div>No result found</div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.main} ref={searchRef}>
        <input
          className={styles.search}
          onChange={(e) => optimizedFn(e.target.value)}
          placeholder="Search by username"
          type="text"
        />
        {loading ? loading : searchList}
        <Pagination
          className={styles.pagination}
          currentPage={currentPage}
          totalCount={data?.items?.length || 0}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
