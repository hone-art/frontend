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
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [currentDate, setCurrentDate] = useState<number>(new Date().getDate());
    const [currentDay, setCurrentDay] = useState<number>(new Date().getDay());
    const [currentDateToRender, setCurrentDateToRender] = useState<number>();
    
    const calculateMonthTotalEntries = (days: number[]): number => {
        let result:number = 0;
        for (let i:number = 0; i < days.length; i++) {
            result += days[i];
        }
        return result;
    }
    
    const generateDaysForRender = (currentDate:number, currentDay:number):void => {
        const numberOfDaysToAdd = currentDay + 7 - (currentDate-1) % 7;
        const array: number[] = new Array(numberOfDaysToAdd).fill(-1);
        setDays([...array, ...days]);
        setCurrentDateToRender(currentDate + numberOfDaysToAdd);
    }
    

    useEffect(() => {
        setTotalEntries(calculateMonthTotalEntries(days));
        generateDaysForRender(currentDate, currentDay);
    }, []);

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
                    let style = (currentDateToRender && (currentDateToRender-1))===index? 
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
            {currentDate}
                {currentDay}
                {currentMonth}
            
        </section>
            
        
    )
}

export default Heatmap;