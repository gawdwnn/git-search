import styles from "@styles/Home.module.css";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@components/loader/loader";
import { search, searchSelector } from "../../redux";

export default function Home() {
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const { data, pending, error } = useSelector(searchSelector);

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

  console.log({ data, pending, error });

  const loading = pending && <Loader />;

  const searchList =
    data && data?.items?.length ? (
      <ul className={styles.results}>
        {data.items.map(({ id, login, avatar_url }, item) => (
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

  /**
   *
    If the results are not complete in one page, the pagination is shown on the screen
   */

  // add value to input

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
      </div>
    </div>
  );
}
