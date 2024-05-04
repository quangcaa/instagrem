const connection = mongoose.connection;
connection.once('open', () => {
  const postChangeStream = connection.collection('posts').watch();

  postChangeStream.on('change', async (change) => {
    if (change.operationType === 'delete') {
      const deletedPostId = change.documentKey._id;

      // Here you would need to have a way to get the S3 key of the deleted post
      // This could be stored in another collection in the database
      const s3Key = await getS3Key(deletedPostId);

      // Delete the image from the S3 bucket
      const deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: s3Key
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await s3.send(deleteCommand);
    }
  });
});