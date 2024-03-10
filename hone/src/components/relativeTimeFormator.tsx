import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Props {
    date: Date;
}

const RelativeTime: React.FC<Props> = ({ date }) => {
    const relativeTime = formatDistanceToNow(date, { addSuffix: true });
    return <div>{relativeTime}</div>;
};

export default RelativeTime