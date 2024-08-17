import { View, Text, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { DataProvider, LayoutProvider, RecyclerListView } from "recyclerlistview";

const inbox = () => {
  const postsTemp = [
    {
      id: 38,
      tags: ["Travel", "Books"],
      timestamp: "2024-08-15T08:37:57.000Z",
      title:
        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      user_id: "uid008",
      username: "MusicLover",
      vote_count: 1,
    },
    {
      id: 39,
      tags: ["Music", "Food", "Fitness", "Gaming"],
      timestamp: "2024-08-15T08:37:57.000Z",
      title:
        "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? ",
      user_id: "uid009",
      username: "Foodie",
      vote_count: 0,
    },
    {
      id: 40,
      tags: ["Movies", "Plants"],
      timestamp: "2024-08-15T08:37:57.000Z",
      title:
        "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      user_id: "uid010",
      username: "FitnessFanatic",
      vote_count: 1,
    },
    {
      id: 41,
      tags: null,
      timestamp: "2024-08-15T08:37:57.000Z",
      title:
        "At vero eos et accusamus et voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. ",
      user_id: "uid011",
      username: "GamerGeek",
      vote_count: 0,
    },
  ];

  const [posts, setPosts] = useState(postsTemp);

  const [dataProvider, setDataProvider] = useState(new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([]));

  const layoutProvider = new LayoutProvider(
    (index) => {
      return 0;
    },
    (type, dim) => {
      dim.width = Dimensions.get("window").width;
      dim.height = 200;
    }
  );

  const rowRenderer = (type, data) => {
    return (
      <View>
        <Text>{data.title}</Text>
        <Text>{data.username}</Text>
        <Text>{data.timestamp}</Text>
      </View>
    );
  };

  useEffect(() => {
    setDataProvider(dataProvider.cloneWithRows(posts));
  }, []);

  return (
    <View className="flex-1">
      <RecyclerListView
        onEndReached={() => {
          setPosts([...posts, ...postsTemp]);
          setDataProvider(dataProvider.cloneWithRows([...posts, ...postsTemp]));
        }}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        // scrollViewProps={{
        //   showsVerticalScrollIndicator: false,
        // }}
      />
    </View>
  );
};

export default inbox;
