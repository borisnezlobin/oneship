const NewsItem = ({ item }) => {
    var description = item.description.replaceAll("\r", "").replaceAll("\n", "");
    if(description.length > 256) description = description.substring(0, 256) + "...";
    return (
        <div className="border border-grey rounded-lg p-4 m-4" style={{
            width: "90%",
            marginLeft: "5%",
            cursor: "pointer",
        }} onClick={() => {
            window.open(item.link);
        }}>
            <h1 className="mediumText">{item.title}</h1>
            <p>
            {item.authors.map((e, i) => {
                return (
                    <a className="link" key={"author" + item.title + i} href={e.authorLink}>
                        {e.authorName}{i === item.authors.length - 1 ? "" : ", "}
                    </a>
                )
            })}
            {item.authors.length > 0 ? " with " : ""}{item.publication} on {item.published.trim()}
            </p>
            <hr />
            <p className="text-lg">{description}</p>
            <p className="text-sm">{item.date}</p>
            { /* media */}
            <div className="w-full">
            {item.isVideo ? (
                <iframe
                    src={item.embedURL}
                    className="w-full h-128"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true}
                    style={{
                        height: 512
                    }}
                />
            ) : (
                <img
                    src={item.image}
                    className="w-full h-128"
                    alt={item.title}
                    style={{
                        objectFit: "cover",
                        backgroundSize: "cover",
                    }}
                />
            )}
            </div>
        </div>
    )
};

export default NewsItem;