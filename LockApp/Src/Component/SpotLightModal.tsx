import { useSpotlightTour } from "@stackbuilders/react-native-spotlight-tour";
import React, { ReactElement } from "react";
import { Button, Text, TouchableOpacity } from "react-native";

import { BoldText, ButtonsGroupView, DescriptionText, SpotDescriptionView } from "./SpotLightStyle";
import { RFValue } from "react-native-responsive-fontsize";
import { FONTS } from "../assets/fonts";

export function DocsTooltip({title,body, isPrevious, isNext, isFinish}): ReactElement {
  // You can also use the hook instead of the props here!
  const { previous, next, stop } = useSpotlightTour();

  return (
    <SpotDescriptionView>
      <DescriptionText>
        <BoldText>{`${title}\n`}</BoldText>
        {`${body}\n`}
        {/* {isNext && "If you want to go to the next step, please press "}{isNext && <BoldText>{"Next.\n"}</BoldText>}
        {isPrevious && "If you want to go to the previous step, press "}{isPrevious && <BoldText>{"Previous.\n"}</BoldText>}
        {isFinish && "If you want to finish the, press "}{isFinish && <BoldText>{"Finish.\n"}</BoldText>} */}
      </DescriptionText>

      <ButtonsGroupView>
        {isPrevious &&  <TouchableOpacity onPress={previous} style={{marginHorizontal:RFValue(2),borderWidth:RFValue(1),borderColor:"#DDD",borderRadius:RFValue(4),paddingVertical:RFValue(4),paddingHorizontal:RFValue(10)}}><Text style={{fontFamily:FONTS.HELVETICA_BOLD,fontSize:RFValue(12),color:"#DDD"}}>Previous</Text></TouchableOpacity>}
        {!isFinish &&  <TouchableOpacity onPress={stop} style={{marginHorizontal:RFValue(2),borderWidth:RFValue(1),borderColor:"#DDD",borderRadius:RFValue(4),paddingVertical:RFValue(4),paddingHorizontal:RFValue(10)}}><Text style={{fontFamily:FONTS.HELVETICA_BOLD,fontSize:RFValue(12),color:"#DDD"}}>Skip Tour</Text></TouchableOpacity>}
        {isNext &&  <TouchableOpacity onPress={next} style={{marginHorizontal:RFValue(2),borderWidth:RFValue(1),borderColor:"#DDD",borderRadius:RFValue(4),paddingVertical:RFValue(4),paddingHorizontal:RFValue(10)}}><Text style={{fontFamily:FONTS.HELVETICA_BOLD,fontSize:RFValue(12),color:"#DDD"}}>Next</Text></TouchableOpacity>}
        {isFinish &&  <TouchableOpacity onPress={stop} style={{marginHorizontal:RFValue(2),borderWidth:RFValue(1),borderColor:"#DDD",borderRadius:RFValue(4),paddingVertical:RFValue(4),paddingHorizontal:RFValue(10)}}><Text style={{fontFamily:FONTS.HELVETICA_BOLD,fontSize:RFValue(12),color:"#DDD"}}>Finish</Text></TouchableOpacity>}
      </ButtonsGroupView>
    </SpotDescriptionView>
  );
}