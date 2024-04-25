const { sequelize, User, Follow } = require('../mysql_models')

class SearchController {

    // [POST] /search
    // @desc search user
    // @access Private
    async search(req, res) {
        const { term } = req.body
        const user_is_searching = req.user.user_id

        if (!term) {
            return res.status(400).json({ message: 'Please provide search term' })
        }

        try {
            const searchResults = await sequelize.query(
                `
                SELECT 
                    u.username,
                    u.full_name,
                    u.profile_image_url,
                    CASE
                        WHEN f.followed_user_id IS NOT NULL THEN 2
                        ELSE 1
                    END AS isFollowing
                FROM users u
                LEFT JOIN 
                    (
                        SELECT DISTINCT followed_user_id
                        FROM follows
                        WHERE follower_user_id = ?
                    ) AS f ON u.user_id = f.followed_user_id
                WHERE MATCH(u.username) AGAINST ('+' ? '*' IN BOOLEAN MODE)
                ORDER BY isFollowing DESC
                LIMIT 40                
                `
                , {
                    replacements: [user_is_searching, term],
                    type: sequelize.QueryTypes.SELECT,
                })

            if (searchResults.length === 0) {
                return res.status(200).json({ success: true, message: 'No user found' })
            }

            return res.status(200).json({ success: true, searchList: searchResults })
        } catch (error) {
            console.error('Error search function in SearchController: ', error)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
}

module.exports = new SearchController()