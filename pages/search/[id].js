import styles from "@styles/Home.module.css";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function SearchDetails(props) {
  const router = useRouter();
  const {
    query: { login },
  } = router;
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const getGithubData = useCallback(() => {
    let endpoints = [
      `https://api.github.com/users/${login}/repos`,
      `https://api.github.com/users/${login}/followers`,
      `https://api.github.com/users/${login}/following`,
    ];
    Promise.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
      ([{ data: repos }, { data: followers }, { data: following }]) => {
        setRepos(repos);
        setFollowers(followers);
        setFollowing(following);
      }
    );
  }, [login]);

  useEffect(() => {
    getGithubData();
  }, [getGithubData]);

  const repoData = repos.length
    ? repos.map((r) => <li key={r.id}>{r.name}</li>)
    : "No repositories found";

  const followerData = followers.length
    ? followers.map((f) => <li key={f.id}>{f.login}</li>)
    : "No followers found";

  const followingData = following.length
    ? following.map((f) => <li key={f.id}>{f.login}</li>)
    : "No data found";

  return (
    <div className={styles.details}>
      <div>
        <h4>Repositories</h4>
        {repoData}
      </div>
      <div>
        <h5>Followers</h5>
        {followerData}
      </div>
      <div>
        <h4>Following</h4>
        {followingData}
      </div>
    </div>
  );
}
