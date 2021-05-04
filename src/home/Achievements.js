import React from 'react';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

export default function Achievements ({achievements}) {

    function achievementInfoJSX() {
        var jsx = [];
        for (let key in achievements) {
            let achievementInfo = achievements[key];
            let achievementProgress = (achievementInfo['progress'] / achievementInfo['total'] * 100).toFixed(2);
            jsx.push(<div>{key}<Progress percent={achievementProgress}></Progress></div>)
        }
        return jsx;
    }

    return (
        <div style={{margin:'30px'}}>
            {achievementInfoJSX()}
        </div>
    );
}