import { useEffect, useState } from "react";
import LoggedInHeader from "../components/LoggedInHeader";
import LoggedOutHeader from "../components/LoggedOutHeader";
import InspiringEntry from "../components/InspiringEntry";
import { useAuth } from "../hooks/useAuth";
import "../styles/inspiration.css";

interface InspiringEntry {
  "id": number,
  "description": string,
  "img_id": number,
  "project_id": number,
  "user_id": number,
  "created_date": Date,
  "user_name": string,
  "profile_picture": string,
  "entry_img": string
}

const Inspiration = () => {
  const { autoLogin, isLoggedIn } = useAuth();
  const [randomEntries, setRandomEntries] = useState<InspiringEntry[]>();

  useEffect(() => {
    if (!isLoggedIn) autoLogin();
    fetchRandom();

  }, [isLoggedIn])

  async function fetchRandom() {
    const fetchedEntries = await fetch(`${process.env.API_URL}/entries/random/100`);
    const entries = await fetchedEntries.json();
    setRandomEntries(entries);
  }
  return (
    <>
      {isLoggedIn ? <LoggedInHeader /> : <LoggedOutHeader />}
      <section className="inspiration-container">
        <div className="inspiration-title-container">
          <h1 className="inspiration-title">Get inspired!</h1>
          <p>These are all entries that Hone users have made</p>
        </div>
        <div className="inspiration-entries-container">
          {randomEntries?.map((entry) => (
            <InspiringEntry entry={entry} key={entry.id} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Inspiration;