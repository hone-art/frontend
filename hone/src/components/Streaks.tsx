import { User } from "../globals";
import { FC, useState, useEffect } from "react";
import "../styles/streaks.css";

type Props = {
    thisProfileUser: User | undefined
}
type Streaks = {
    current: number;
    longest: number
}

const Streaks: FC<Props> = ({ thisProfileUser }) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    const [currentStreak, setCurrentStreak] = useState<number>(0);
    const [longestStreak, setLongestStreak] = useState<number>(0);

    useEffect(() => {
        fetchStreaks();
    }, []);

    async function fetchStreaks() {
        const formattedDate = (currentDate).toString().padStart(2, '0');
        const formattedMonth = (currentMonth + 1).toString().padStart(2, '0');
        const formattedYear = (currentYear).toString()
        const formattedYearMonthDate = `${formattedYear}-${formattedMonth}-${formattedDate}`;

        const fetchResponse: any = await fetch(`${process.env.API_URL}/entries/users/${thisProfileUser?.id}/streaks/${formattedYearMonthDate}`);
        const fetchedStreaks: any = await fetchResponse.json();
        console.log(fetchedStreaks);
        setStreaks(fetchedStreaks);
    }

    function setStreaks(fetchedStreaks: Streaks) {
        setCurrentStreak(fetchedStreaks.current);
        setLongestStreak(fetchedStreaks.longest);
    }

    return (
        <>
            <div className='streaks'>
                <div className='oneStreak'>
                    <div className='streakTitle'>Current streak:</div>
                    <div className='streakNumber'> {currentStreak} days</div>
                </div>

                <div className='oneStreak'>
                    <div className='streakTitle'>Longest streak:</div>
                    <div className='streakNumber'>{longestStreak} days</div>
                </div>
            </div>
        </>
    );
}

export default Streaks;