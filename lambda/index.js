exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Deployed via CI/CD",
            env: process.env.ENVIRONMENT
        })
    };
};
