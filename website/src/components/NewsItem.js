const NewsItem = ({ item }) => {
    var description = item.description.replaceAll("\r", "").replaceAll("\n", "");
    if(description.length > 256) description = description.substring(0, 256) + "...";
    return (
        <a href={item.link} target="blank" rel="noreferrer" className="rounded-lg p-4 md:p-2 md:p-8" style={{
            width: "100%",
            display: "block",
            cursor: "pointer",
        }} onClick={() => {
            window.open(item.link);
        }}>
            <h1 className="mediumText">{item.title}</h1>
            <p>
            {item.authors.map((e, i) => {
                return (
                    <>
                        <a className="link" key={"author" + item.title + i} href={e.authorLink}>
                            {e.authorName}
                        </a>
                        <span>
                            {i === item.authors.length - 1 ? "" : ", "}
                        </span>
                    </>
                )
            })}
            {item.authors.length > 0 ? " with " : ""}{item.publication} on {item.published.trim()}
            </p>
            <hr className="m-2" />
            <p className="text-0 md:text-lg">{description}</p>
            <p className="text-sm">{item.date}</p>
            { /* media */}
            <div className="w-full">
            {item.isVideo ? (
                <iframe
                    title={item.title}
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
                    className="w-full h-128 rounded-lg"
                    alt={item.title}
                    style={{
                        objectFit: "cover",
                        backgroundSize: "cover",
                    }}
                />
            )}
            </div>
        </a>
    )
};

export default NewsItem;