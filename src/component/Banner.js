import React from 'react';
import '../static/css/banner.css';
import PropTypes from 'prop-types';

export default class Banner extends React.Component{
    static defaultProps = {
        data: [],
        interval: 3000,
        step: 1,
        speed: 300
    };
    static propTypes = {
        data: PropTypes.array,
        interval:PropTypes.number,
        step:PropTypes.number,
        speed: PropTypes.number,
    };
    constructor(props){
        super(props);
        //=>init state
        let { step ,speed } = this.props;
        this.state ={
            step,
            speed,
        };
    };
    //=>数据克隆
    componentWillMount(){
        let { data } = this.props;
        let cloneData = data.slice(0);
        cloneData.push(data[0]);
        cloneData.unshift(data[data.length-1]);
        this.cloneData = cloneData;

    };
    componentDidMount(){
        //=>控制自动轮播
        //=>把定时器返回挂载到实例上，方便后期清除，结束自动轮播
        this.autoTimer = setInterval(this.autoMove,this.props.interval);
    };
    componentWillUpdate(nextProps,nextState){
        //=>边界判断，如果最新修改的step大于最大索引，说明此时已经是末尾了，不能向后走，让其立即回到索引为1的位置
        if(nextState.step>(this.cloneData.length-1)){
            this.setState({
                step:1,
                speed:0
            });
        }
        /**向左边界判断 */
        if(nextState.step<0){
            this.setState({
                step:this.cloneData.length-2,
                speed:0
            });
        }
    };
    componentDidUpdate(){
        //=>监听是否回去 只有是从克隆的第一张切换到真实第一张后，我们才做如下处理，让其从当前第一张，运动到第二张即可
        let {step,speed} =this.state;
        if( step===1&&speed===0){
            //为啥设置定时器延迟，CSS3的tranisition有一个问题，(主栈执行的时候,短时间内遇到两次设置transition-duration的代码，以最后一次设置为主)
           let delayTimer = setTimeout(()=>{
               clearTimeout(delayTimer)
            this.setState({
                step:step+1,
                speed:this.props.speed
            })
           },0)
        }
        /**向左判断 */
        if(step===this.cloneData.length-2&&speed===0){
            let delayTimer = setTimeout(()=>{
                clearTimeout(delayTimer)
             this.setState({
                 step:step-1,
                 speed:this.props.speed
             })
            },0);

        }
    }
    render(){
        let { data } = this.props,
            {cloneData} = this;
            if( data.length === 0) return '';
            //=>控制wrapperd的样式
            let { step, speed } = this.state;
            let wrapperSty ={
                width:cloneData.length*1000+'px',
                left:-step*1000+'px',
                transition:`left ${speed}ms liner 0ms`
            };

        return <section className='container ' 
        onMouseEnter={this.movePause}
         onMouseLeave={this.movePlay}
         onClick={this.handleClick}> 
          <ul className="wrapper" style={wrapperSty}
          
          onTransitionEnd={() => {
            //=>当WRAPPER切换动画完成（切换完成），再去执行下一次切换任务
            this.isRun = false;
        }}
          >
              
              
              {
                  cloneData.map((item,index)=>{
                      let { pic , title } = item;
                      return <li><img src={pic} alt={title}/></li>
                  })
              }
          </ul>
          <ul className="focus">
          {data.map((item, index) => {
                    /*焦点对齐：图片索引减去一就是焦点选中项对应的索引（特殊的：如果图片索引是零，让最后一个焦点选中，如果图片索引是最大，让第一个焦点选中）*/
                    let tempIndex = step - 1;
                    step === 0 ? (tempIndex = data.length - 1) : null;
                    step === (cloneData.length - 1) ? tempIndex = 0 : null;

                    return <li key={index} className={index === tempIndex ? 'active' : ''}></li>;
                })}
          </ul>
          <a href="javascript:;" className="arrow arrowLeft" ></a>
          <a href="javascript:;" className="arrow arrowRight"></a>
        </section>
    };
    //=>向右切换
    autoMove =()=>{
        this.setState({
            step:this.state.step+1,
        })

    };
    //=>自动播放暂停和开启
    movePause=()=>{
        clearInterval(this.autoTimer)
    }
    movePlay = ()=>{
        this.autoTimer = setInterval(this.autoMove,this.props.interval)
    }
    //=>事件委托
    handleClick = ev =>{
        let target = ev.target,
            tarTag = target.tarName,//获得标签名
            tarClass = target.className;//获得样式
            //=>左右切换按钮
            if(tarTag === 'A' &&   /(^| +)arrow(+|$)/.test.className){//标签名 A
              //防止过快点击   
                if(this.isRun) return;
              this.isRun =true;
                //=>right
              if(tarClass.indexof('arrowRight')>=0) {
                  this.autoMove();
                  //=>left
                  this.setState({
                    step:this.state.step-1,
                })
                  return;
              }
            }
    };
}