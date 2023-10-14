const NewsItem = ({ item }) => {
    var description = item.description.replaceAll("\r", "").replaceAll("\n", " ");
    if(description.length > 256) description = description.substring(0, 256) + "...";
    return (
        <div target="blank" rel="noreferrer" className="rounded-lg md:gap-4 p-4 md:p-8 md:flex md:flex-row-reverse md:items-start md:justify-start" style={{
            width: "100%",
        }}>
        <div style={{
            width: "100%",
        }}>
            <a
                href={item.link}
                target="blank"
                className="mediumText link"
            >
                {item.title}
            </a>
            <p>
            {item.authors.map((e, i) => {
                return (
                    <>
                        <a className="link" target="blank" key={"author" + item.title + i} href={e.authorLink}>
                            {e.authorName}
                        </a>
                        <span>
                            {i === item.authors.length - 1 ? "" : ", "}
                        </span>
                    </>
                )
            })}
            {item.authors.length > 0 ? " with " : ""}{item.publication} on{" "}
                {item.published.trim()}
            </p>
            <hr className="m-2" />
            <p className="text-0 md:text-lg">{description}</p>
            <p className="text-sm">{item.date}</p>
            </div>
            { /* media */}
            <div className="w-full md:w-96 md:h-48">
            {item.isVideo ? (
                <iframe
                    title={item.title}
                    src={item.embedURL}
                    className="h-48 md:w-full md:h-48 rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true}
                />
            ) : (
                <img
                    src={item.image}
                    className="w-full h-48 rounded-lg"
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