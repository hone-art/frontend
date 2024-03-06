import React, { useState } from 'react';
import AWS from 'aws-sdk';

// Configuring AWS SDK
AWS.config.update({
  accessKeyId: 'BMTVY55YKD6A9ST73YF3',
  secretAccessKey: 'zMgYis7sAVudEpNY0hsDWnQWQkmAWlDS3FHBYvMQ',
  region: 'ap-northeast-1',
});

const s3 = new AWS.S3();

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: selectedFile.name,
      Body: selectedFile,
      ACL: 'public-read', // You might want to change this
    };

    s3.upload(params, function(err, data) {
      if (err) {
        console.error("Error", err);
        alert('Upload failed');
      } else {
        alert('Upload successful. File URL:', data.Location);
      }
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileInput} />
      <button onClick={handleUpload}>Upload to S3</button>
    </div>
  );
}

export default ImageUpload;