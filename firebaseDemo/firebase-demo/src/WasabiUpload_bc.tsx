import React, { useState, ChangeEvent } from 'react';
import S3 from 'aws-sdk/clients/s3';


const WasabiUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const s3 = new S3({
        accessKeyId: 'BMTVY55YKD6A9ST73YF3',
        secretAccessKey: 'zMgYis7sAVudEpNY0hsDWnQWQkmAWlDS3FHBYvMQ',
        endpoint: 's3.ap-northeast-1.wasabisys.com',
        region: 'ap-northeast-1' // Change this to your bucket's region if different
    });

    const uploadFile = () => {
        if (file) {
            const uploadParams = {
                Bucket: 'hone.art',
                Key: file.name,
                Body: file,
                // ACL: 'public-read' // optional, if you want the file to be publicly accessible
            };

            (async () => {
                await s3.putObject(uploadParams).promise()
            })
        }
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]){
            setFile(e.target.files[0]);
        }
        
    };

    return (
        <div>
            <input type="file" onChange={handleFileInput} />
            <button onClick={uploadFile}>Upload to Wasabi</button>
        </div>
    );
    
};

export default WasabiUpload