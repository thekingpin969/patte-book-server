import formateTime from "./formateTime";

function groupData(data = []) {
    const grouped = data.reduce((acc: any, item: any) => {
        const key = formateTime(item.time);
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    return grouped;
}

export default groupData