import React, { useState } from 'react';

const TestJs = () => {

    const [name, setName] = useState('gujiaxian');
    // setName("zhoushaoyun");
    return (
        <div>
            <p>hello</p>
            <p>{name}</p>
        </div>
    );
};

export default TestJs