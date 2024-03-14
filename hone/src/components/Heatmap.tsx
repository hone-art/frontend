import { Divider } from "@chakra-ui/react";
import "../styles/heatmap.css";
import { FC, useState, useEffect, useRef } from "react";
const Heatmap = () => {
    
    // const colors = {
    //     1: "color: #FFFFFF",
    //     3: "color: #1c0000"
    // }
    const [days, setDays] = useState<number[]>([1,0,0,2,3,4,5,7,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1]);
    const [thisMonthTotalEntries, setTotalEntries] = useState<number>(0);
    const [currentMonth, setCurrentMonth] = useState<number>(1);
    const [currentDate, setCurrentDate] = useState<number>(1);
    const [currentDay, setCurrentDay] = useState<number>(1);
    const [currentDateForRender, setCurrentDateForRender] = useState<number>();
    
    useEffect(() => {
        getCurrentDate();
        setTotalEntries(calculateMonthTotalEntries(days));
        generateDaysForRender(currentDate, currentDay);
    }, []);

    const getCurrentDate = () => {
        const newDate: Date = new Date();
        setCurrentMonth(newDate.getMonth());
        setCurrentDate(newDate.getDate());
        setCurrentDay(newDate.getDay());
    }

    const calculateMonthTotalEntries = (days: number[]): number => {
        let result:number = 0;
        for (let i:number = 0; i < days.length; i++) {
            if (days[i] >= 0) {
                result += days[i];
            }
        }
        return result;
    }
    
    const generateDaysForRender = (currentDate:number, currentDay:number):void => {
        const numberOfDaysToAdd = currentDay + 7 - (currentDate-1) % 7;
        const array: number[] = new Array(numberOfDaysToAdd).fill(-1);
        setDays([...array, ...days]);
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