import "../styles/heatmap.css";
const Heatmap = () => {
    const days = [1,0,0,2,3,4,5,7,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    // const colors = {
    //     1: "color: #FFFFFF",
    //     3: "color: #1c0000"
    // }

    function getColor (num: number) {
        if (num < 1) return {backgroundColor:"#e6e6e6"};
        if (num === 1) return {backgroundColor:"#adaaac"};
        if (num === 2 ) return {backgroundColor:"#777277"};
        if (num === 3 ) return {backgroundColor:"#434046"};
        return {backgroundColor:"#13131A"};
    }
    return (
     
            <section className='heatmap-container'>
                <div id='heatmap-title'>
                    20 entries this month
                </div>
                <div className='heatmap-body'>
                    {days.map((day) => <div className='one-day' style={getColor(day)}></div>)}
                </div>
            </section>
            
        
    )
}

export default Heatmap;