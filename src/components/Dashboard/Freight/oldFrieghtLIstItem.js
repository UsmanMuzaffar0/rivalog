RenderItem = (data, index) => {
  return (
    <View style={[Style.TrailerListItemContailer]}>
      <TouchableOpacity
        onPress={() => {
          this.setState({ OpenOptionDialog: true, SelectedFreightObj: data });
          this.flatListRef.scrollToIndex({
            animated: true,
            index: index,
          });
        }}
      >
        <View style={{ marginVertical: RFValue(10) }}>
          <View>
            <Text
              style={[
                Style.EmailTxt,
                { color: colors.Grey, marginBottom: RFValue(2) },
              ]}
            >
              {StringsOfLanguages.Description}
            </Text>
            <Text style={Style.DropdownItemTxt}>{data.description}</Text>
          </View>
        </View>

        <View
          style={{ flexDirection: "row", flex: 1, marginBottom: RFValue(10) }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                Style.EmailTxt,
                { color: colors.Grey, marginBottom: RFValue(2) },
              ]}
            >
              {StringsOfLanguages.Price}
            </Text>
            <Text style={Style.DropdownItemTxt}>
              {new Intl.NumberFormat(this.state.lang + "-IN").format(
                data.price
              )}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                Style.EmailTxt,
                { color: colors.Grey, marginBottom: RFValue(2) },
              ]}
            >
              {StringsOfLanguages.Currency}
            </Text>
            <Text style={Style.DropdownItemTxt}>
              {data.description ? data.priceCurrency.currencyCode : "-"}
            </Text>
          </View>
        </View>

        <View
          style={{ flexDirection: "row", flex: 1, marginBottom: RFValue(10) }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                Style.EmailTxt,
                { color: colors.Grey, marginBottom: RFValue(2) },
              ]}
            >
              {StringsOfLanguages.PlannedArrivalDate}
            </Text>
            <Text style={Style.DropdownItemTxt}>
              {data.plannedArrivalDate
                ? new Date(data.plannedArrivalDate)
                    .toLocaleString(this.state.lang + "-IN")
                    .split(" ")[0]
                    .split(",")[0]
                : "-"}
              {}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                Style.EmailTxt,
                { color: colors.Grey, marginBottom: RFValue(2) },
              ]}
            >
              {StringsOfLanguages.PlannedDepartureDate}
            </Text>
            <Text style={Style.DropdownItemTxt}>
              {data.plannedDepartureDate
                ? new Date(data.plannedDepartureDate)
                    .toLocaleString(this.state.lang + "-IN")
                    .split(" ")[0]
                    .split(",")[0]
                : "-"}
            </Text>
          </View>
        </View>

        <View style={[Style.divider, { marginBottom: RFValue(10) }]} />

        <View style={{ flex: 1, flexDirection: "row" }}>
          <View>
            <View
              style={{
                height: "100%",
                width: 1,
                backgroundColor: "lightgrey",
                alignSelf: "center",
                position: "absolute",
              }}
            />
            <View
              style={{
                height: RFPercentage(5),
                width: RFPercentage(5),
                backgroundColor: "#f5f5f5",
                marginBottom: 20,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  height: RFPercentage(2.5),
                  width: RFPercentage(2.5),
                  resizeMode: "contain",
                  overflow: "hidden",
                }}
                source={require("../../../assets/images/icn_location_placeholder.png")}
              />
            </View>
            <View
              style={{
                height: RFPercentage(5),
                width: RFPercentage(5),
                backgroundColor: "#f5f5f5",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  height: RFPercentage(2.5),
                  width: RFPercentage(2.5),
                  resizeMode: "contain",
                  overflow: "hidden",
                }}
                source={require("../../../assets/images/icn_navigation.png")}
              />
            </View>
          </View>
          <View style={{ marginLeft: 5, flex: 1 }}>
            <View
              style={{
                height: "100%",
                position: "absolute",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: "lightgrey",
                  alignSelf: "center",
                  position: "absolute",
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                height: RFPercentage(5),
                marginBottom: 20,
              }}
            >
              <Text style={Style.DropdownItemTxt}>
                {data.fromLocation.city.name} , {data.fromLocation.country.name}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                height: RFPercentage(5),
              }}
            >
              <Text style={Style.DropdownItemTxt}>
                {data.toLocation.city.name} , {data.toLocation.country.name}
              </Text>
            </View>
          </View>
        </View>
        {!!(data?.appliedForTransport === "Y") && (
          <View style={{ position: "absolute", right: 0 }}>
            <Image
              source={IMAGES.approved}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
