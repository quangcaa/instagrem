// async followUser(req, res) {
//     const { username } = req.params;
//     const user_id = req.user.user_id;

//     try {
//         // check if user exists
//         const userResults = await User.findOne(
//             { where: { username } },
//             { attributes: ['user_id'] }
//         );

//         if (!userResults) {
//             return res.status(400).json({ success: false, error: 'User not found' });
//         }

//         if (userResults.user_id === user_id) {
//             return res.status(400).json({ success: false, error: 'Cannot follow yourself' });
//         }

//         const userFollowed = userResults.user_id;

//         // check if already followed
//         const checkFollowed = await Follow.findOne(
//             { where: { follower_user_id: user_id, followed_user_id: userFollowed } }
//         );

//         if (!checkFollowed) {
//             // follow
//             await Follow.create({
//                 follower_user_id: user_id,
//                 followed_user_id: userFollowed
//             });

//             // send follow activity
//             sendFollowActivity(req, user_id, userFollowed, 'follows', 'Followed you');

//             // Update cached user's followers count
//             const cachedData = await client.get(`user:${userFollowed}`);
//             if (cachedData) {
//                 const userInfo = JSON.parse(cachedData);
//                 userInfo.followers += 1;
//                 await client.set(`user:${userFollowed}`, JSON.stringify(userInfo), { EX: 180 });
//             }

//             return res.status(200).json({ success: true, message: 'Followed ! ! !' });
//         }

//         // if followed, unfollow
//         await Follow.destroy(
//             {
//                 where: {
//                     follower_user_id: user_id,
//                     followed_user_id: userFollowed
//                 }
//             }
//         );

//         // Update cached user's followers count
//         const cachedData = await client.get(`user:${userFollowed}`);
//         if (cachedData) {
//             const userInfo = JSON.parse(cachedData);
//             userInfo.followers -= 1;
//             await client.set(`user:${userFollowed}`, JSON.stringify(userInfo), { EX: 180 });
//         }

//         return res.status(200).json({ success: true, message: 'Unfollowed ! ! !' });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// }
