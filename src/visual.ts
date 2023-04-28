import '../style/visual.less';


const AdvancedFilter = WynVisual.Models.Filter.AdvancedFilter;
const Enums = WynVisual.Enums;
const PLACEHOLDER = "input_placeholder";
const INPUTBGCOLOR = "input_bgColor";
const INPUTTEXT = "input_text";
const TITLE = "input_title";
const TITLE_TEXT_STYLE = "title_textStyle";
const INPUTSTYLE = "input_style";
const INPUTBOCOLOR = "input_borderColor";
const SHOWTITLE = "show_title";
const TITLEPADDING = "title_padding";

export default class Visual extends WynVisual {

  private dom : HTMLElement;

  private inputEle : HTMLInputElement;
  private titleEle  : HTMLDivElement;
  // private btnEle : HTMLButtonElement;
  private host : VisualNS.VisualHost;
  
  private styleOption : any;
  private isMock : boolean;
  private filter : VisualNS.AdvancedFilter;

  private operator : any =Enums.AdvancedFilterOperator.Contains;
  private caseSensitive : boolean = false;
  private targetPara;
  private once : number = 0;
  
  private static root : Visual;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    Visual.root = this;
    this.dom = dom;
    this.host = host;
    Visual.root = this;
  


  }

  private initDom(){

    this.dom.innerHTML = `

    <div class="dd-chart-wrapper" style="overflow: hidden;align-items: center;">
      <div class="dd-chart-title">搜索框标题</div>
      <div class="dd-chart-content">
        <input type="text" class="input-ele" placeholder="请输入关键字">
      </div>
    </div>
    `;


    this.inputEle = document.getElementsByClassName("input-ele")[0] as HTMLInputElement;
    // this.btnEle = document.getElementsByClassName("btn-ele")[0] as HTMLButtonElement;
    this.titleEle = document.getElementsByClassName("dd-chart-title")[0] as HTMLDivElement;
    this.titleEle = document.getElementsByClassName("dd-chart-title")[0] as HTMLDivElement;


    // this.btnEle.addEventListener('click',this.Submit);
    this.inputEle.addEventListener('blur',this.Submit);
    this.inputEle.addEventListener('keydown',
    function(event:KeyboardEvent){
      if(event.keyCode == 13){
      Visual.root.Submit();
      }
  })

  }
  private Submit = ()=>{
    
    let val = this.inputEle.value;
   
    if(!this.isMock){
      if(!val){
        this.host.filterService.clean();
      }else {
        this.filter.setConditions([{
          value: val,
          operator: (this.operator) || Enums.AdvancedFilterOperator.Contains,
          caseSensitive: this.caseSensitive,
        }]);
        this.host.filterService.applyFilter(this.filter);
      }
    }
    if(this.targetPara){
      this.host.parameterService.setParameter({
        name: this.targetPara.meta.name,
        value : [val],
      })
    }
  }

  public update(options: VisualNS.IVisualUpdateOptions) {

    const dv = options.dataViews[0];

    this.targetPara = options.watchedParameters['target'];
    if(this.once == 0){
       this.initDom();
      (this.once)++;
      if(this.targetPara){
        this.host.parameterService.setParameter({
          name: this.targetPara.meta.name,
          value : [this.inputEle.value],
        })
      }
    }

    this.styleOption = options.properties;
    this.applyStyleOption();

    if (dv && dv.plain) {
      const profile = dv.plain.profile.dimensions.values[0];
      const filter = new AdvancedFilter(profile);
      filter.fromJSON(options.filters[0] as VisualNS.IAdvancedFilter);
      this.filter = filter;
      this.isMock = false;
    } else {
      this.filter = null;
      this.isMock = true;
    }

    // removefilter
    if(this.filter != null && this.filter.getConditions().length==0){
      this.inputEle.value ="";
    }
    
  }

  public applyStyleOption = ()=>{
    let css = {};
    if(this.styleOption[SHOWTITLE]){
      this.titleEle.style.display = "block";
    }else{
      this.titleEle.style.display = "none";
    }
    if(this.styleOption[PLACEHOLDER] != undefined){
      this.inputEle.placeholder = this.styleOption[PLACEHOLDER]||"";
    }
    if(this.styleOption[TITLE] != undefined){
      this.titleEle.innerHTML = this.styleOption[TITLE]||"";
    }

    if(this.styleOption[TITLE_TEXT_STYLE]){
      this.titleEle.style.fontSize = this.styleOption[TITLE_TEXT_STYLE].fontSize;
      this.titleEle.style.fontFamily = this.styleOption[TITLE_TEXT_STYLE].fontFamily;
      this.titleEle.style.fontStyle = this.styleOption[TITLE_TEXT_STYLE].fontStyle;
      this.titleEle.style.fontWeight = this.styleOption[TITLE_TEXT_STYLE].fontWeight;
      this.titleEle.style.color = this.styleOption[TITLE_TEXT_STYLE].color;
    }

    if(this.styleOption[INPUTSTYLE]){
      if(this.styleOption[INPUTSTYLE] == "inline"){
          this.titleEle.parentElement.style.display = "flex";
      }else if(this.styleOption[INPUTSTYLE] == "block"){
          this.titleEle.parentElement.style.display = "block";
      }
    }
    if(this.styleOption[TITLEPADDING]){
      this.titleEle.style.paddingLeft = `${this.styleOption[TITLEPADDING]["left"]}px`;
      this.titleEle.style.paddingRight = `${this.styleOption[TITLEPADDING]["right"]}px`;
      this.titleEle.style.paddingTop = `${this.styleOption[TITLEPADDING]["top"]}px`;
      this.titleEle.style.paddingBottom = `${this.styleOption[TITLEPADDING]["bottom"]}px`;
    }

    if(this.styleOption[INPUTBOCOLOR]){
      this.inputEle.style.borderColor = this.styleOption[INPUTBOCOLOR];
    }
    if(this.styleOption[INPUTBGCOLOR]){
      this.inputEle.style.backgroundColor = this.styleOption[INPUTBGCOLOR];
    }
    if(this.styleOption[INPUTTEXT]){
      this.inputEle.style.fontSize = this.styleOption[INPUTTEXT].fontSize;
      this.inputEle.style.fontFamily = this.styleOption[INPUTTEXT].fontFamily;
      this.inputEle.style.fontStyle = this.styleOption[INPUTTEXT].fontStyle;
      this.inputEle.style.fontWeight = this.styleOption[INPUTTEXT].fontWeight;
      this.inputEle.style.color = this.styleOption[INPUTTEXT].color;
    }
    
  }


  public onDestroy(): void {

  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    const styleConfig = options.properties;
    let showTitle = styleConfig[SHOWTITLE];
    let hiddenKey = [];
    if(!showTitle){
      hiddenKey.push(TITLE);
      hiddenKey.push(TITLE_TEXT_STYLE);
      hiddenKey.push(TITLEPADDING);
    }
    return hiddenKey;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}