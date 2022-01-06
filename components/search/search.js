import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import styles from "./search.module.css";
import Loader from "../loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { search, searchSelector } from "../../redux";

export default function Search() {
  const searchRef = useRef(null);
  const [active, setActive] = useState(false);
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

  const onFocus = useCallback(() => {
    setActive(true);
    window.addEventListener("click", onClick);
  }, []);

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false);
      window.removeEventListener("click", onClick);
    }
  }, []);

  console.log({ data, pending, error });

  const loading = pending && <Loader />;
  
  //After the search is completed, 
  // the application shows the list of users along with their avatar and their username on the same page
  const searchList =
    active && data?.items?.length > 0 ? (
      <ul className={styles.results}>
        {data.items.map(({ id, login }) => (
          <li className={styles.result} key={id}>
            <Link href="/posts/[id]" as={`/posts/${id}`}>
              <a>{login}</a>
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      `No result found`
    );

  return (
    <div className={styles.container} ref={searchRef}>
      <input
        className={styles.search}
        onChange={(e) => optimizedFn(e.target.value)}
        onFocus={onFocus}
        placeholder="Search by username"
        type="text"
      />
      {loading ? loading : searchList}
    </div>
  );
}
