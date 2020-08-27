import Select from 'react-select';
import $ from 'jquery';

class MultiSelect extends Select{

    constructor(props){
        super(props);
        $(document).ready(() => {
            $('.select__dropdown-indicator svg').html("<path d='M7 10l5 5 5-5z'></path>");
            $('#' + props.id+ ' input').focus(() => {
                $('#' + props.id+ ' .css-yk16xz-control').css('borderBottom', '1.5px solid rgba(0, 0, 0, 0.87)');
                setTimeout(function(){
                    if($('#' + props.id+ ' .select__value-container .select__multi-value').length == 0){
                        $('#' + props.placeholderId+ ' label').attr('style', 'font-size: 11px !important; top: 0px;');
                        $('#' + props.id+ ' .select__indicators span').show()
                    }
                },0);
            });
            $('#' + props.id+ ' input').focusout(() => { 
                $('#' + props.id+ ' .css-yk16xz-control').css('borderBottom', '1px solid rgba(0, 0, 0, 0.42)');
                setTimeout(function(){
                    if($('#' + props.id+ ' .select__value-container .select__multi-value').length == 0){
                        $('#' + props.placeholderId+ ' label').attr('style', 'font-size: 14px !important; top: 23px;');
                        $('#' + props.id+ ' .select__indicators span').hide()
                    }
                },0);
            });
        });
    }

}

export default MultiSelect