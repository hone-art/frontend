import { Divider } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../hooks/useAuth' 
import "../styles/heatmap.css";
import { FC, useState, useEffect, useRef } from "react";

type Props = {
    isUser: boolean;
}
const Heatmap: FC<Props> = ({ isUser }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [days, setDays] = useState<number[]>([]);
    const [thisMonthTotalEntries, setTotalEntries] = useState<number>(0);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [currentDate, setCurrentDate] = useState<number>(new Date().getDate());
    const [currentDay, setCurrentDay] = useState<number>(new Date().getDay());
    const [currentDateForRender, setCurrentDateForRender] = useState<number>();
    
    useEffect(() => {
        
        generateDaysForRender(currentDate, currentDay);
        setTotalEntries(calculateMonthTotalEntries(days));
    }, []);

    const calculateMonthTotalEntries = (days: number[]): number => {
        let result:number = 0;
        for (let i:number = 0; i < days.length; i++) {
            if (days[i] >= 0) {
                result += days[i];
            }
        }
        console.log("total entries-========", result);
        return result;
    }
    
    async function generateDaysForRender(currentDate:number, currentDay:number) {
        const formattedMonth = (currentMonth + 1).toString().padStart(2, '0');
        const formattedYearMonth = `${currentYear}-${formattedMonth}`
        const fetchResponse = await fetch(`${process.env.API_URL}/entries/users/${user?.id}/months/${formattedYearMonth}`)
        const fetchedDaysEntriesArr = await fetchResponse.json();
        console.log("fetched days entries array==========",fetchedDaysEntriesArr);
        setDays(fetchedDaysEntriesArr);
        console.log("days=========",days);
        const numberOfDaysToAdd = (currentDay + (7 - (currentDate-1) % 7)) % 7;
        console.log("number of days to add======",numberOfDaysToAdd);
        const array: number[] = new Array(numberOfDaysToAdd).fill(-1);
        setDays([...array, ...days]);
        console.log(days);
        setCurrentDateForRender(currentDate + numberOfDaysToAdd);
    }
    
    function getColor (num: number) {
        if (num === -1) return;
        if (num ===0) return {backgroundColor:"#e6e6e6"};
        if (num === 1) return {backgroundColor:"#adaaac"};
        if (num === 2 ) return {backgroundColor:"#777277"};
        if (num === 3 ) return {backgroundColor:"#434046"};
        return {backgroundColor:"#13131A"};
    }

    const renderHeatMap = (days: number[]) => {
        return (
            <>
                {days.map((day:number, index:number) => {
                    let style = (currentDateForRender && (currentDateForRender-1))===index? 
                    {...getColor(day), border:'solid #5356FF', borderWidth:'medium'}:
                    getColor(day);
                    return (
                        <div className='one-day' style={style} key={index}></div>
                    );
                })}
            </>
        )
    }

    
    return (
        <section className='heatmap-container'>
            <div id='heatmap-title'>
                {thisMonthTotalEntries} entries this month
            </div>
            {/* <div>{days.length}</div> */}
            <div className='heatmap-body'>
                {renderHeatMap(days)}   
            </div>
        </section>
    )
}

export default Heatmap;