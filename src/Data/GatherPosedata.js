const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function getDataPoints(getLatestLandmarks) {
    let data = [];

    for (let label of ["Flex"]) {
        for (let i = 0; i < 1; i++) {

            const landmarks = getLatestLandmarks();

            if (landmarks) {
                let lShoulder = landmarks[12];
                let lElbow = landmarks[14];
                let lHand = landmarks[16];

                if (lShoulder && lElbow && lHand) {

                    console.log(lShoulder.y, lElbow.y,lHand.y);
                } else {
                    console.log("Landmarks not fully available. Skipping this point.");
                }
            } else {
                console.log("No landmarks detected. Skipping this iteration.");
            }
        }
    }
    return data;
}
