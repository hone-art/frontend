import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth'
import "../styles/heatmap.css";
import { FC, useState, useEffect } from "react";
import { User } from "../globals";

type Props = {
    isUser: boolean;
    thisProfileUser: User | undefined;
}
const Heatmap: FC<Props> = ({ isUser, thisProfileUser }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [days, setDays] = useState<number[]>([]);
    const [MonthTotalEntries, setTotalEntries] = useState<number>(0);
    const [currentDateForRender, setCurrentDateForRender] = useState<number>();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    const currentDay = new Date().getDay();

    useEffect(() => {
        generateDaysForRender();
    }, [currentDate, currentDay, currentMonth, currentYear, user]);

    useEffect(() => {
        const total = calculateMonthTotalEntries(days);
        setTotalEntries(total);
    }, [days])

    const calculateMonthTotalEntries = (days: number[]): number => {
        let result: number = 0;
        for (let i: number = 0; i < days.length; i++) {
            if (days[i] >= 0) {
                result += days[i];
            }
        }
        return result;
    }

    async function generateDaysForRender() {
        const formattedMonth = (currentMonth + 1).toString().padStart(2, '0');
        const formattedYearMonth = `${currentYear}-${formattedMonth}`;
        const fetchResponse = await fetch(`${process.env.API_URL}/entries/users/${thisProfileUser?.id}/months/${formattedYearMonth}`)
        const fetchedDaysEntriesArr = await fetchResponse.json();

        const numberOfDaysToAdd = (currentDay + (7 - (currentDate - 1) % 7)) % 7;
        const array: number[] = new Array(numberOfDaysToAdd).fill(-1);
        setDays([...array, ...fetchedDaysEntriesArr]);
        setCurrentDateForRender(currentDate + numberOfDaysToAdd);
    }

    function getColor(num: number) {
        if (num === -1) return;
        if (num === 0) return { backgroundColor: "#e6e6e6" };
        if (num === 1) return { backgroundColor: "#adaaac" };
        if (num === 2) return { backgroundColor: "#777277" };
        if (num === 3) return { backgroundColor: "#434046" };
        return { backgroundColor: "#13131A" };
    }

    const renderHeatMap = (days: number[]) => {
        return (
            <>
                {days.map((day: number, index: number) => {
                    let style = (currentDateForRender && (currentDateForRender - 1)) === index ?
                        { ...getColor(day), border: 'solid #F72798', borderWidth: '0.25em' } :
                        getColor(day);
                    return (
                        <div className='one-day' style={style} key={index}></div>
                    );
                })}
            </>
        )
    }

    const handleOnClick = () => {
        navigate(`/${user?.user_name}/calendar`)
    }


    return (
        <section className='heatmap-container'>
            {isUser ?
                <div className='heatmap-title heatmap-title-isUser' onClick={handleOnClick}>
                    {MonthTotalEntries} entr
                    {MonthTotalEntries<=1?<>y </>:<>ies </>}
                     this month
                </div> :
                <div className='heatmap-title'>
                    {MonthTotalEntries} entries this month
                </div>}
            <div className='heatmap-body'>
                {renderHeatMap(days)}
            </div>
            <div className='annotation'>
                <div className='annotation-text'>less</div>
                <div className='annotation-block' id='annotation1'></div>
                <div className='annotation-block' id='annotation2'></div>
                <div className='annotation-block' id='annotation3'></div>
                <div className='annotation-block' id='annotation4'></div>
                <div className='annotation-text'>more</div>
            </div>
        </section>
    )
}

export default Heatmap;