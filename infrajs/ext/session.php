<?php
	global $infrajs;
	infra_wait($infrajs,'oninit',function(){//интеграция session template
		global $infra_template_scope;
		$cl=function($name, $def=null){ return infra_session_get($name,$def); };
		infra_seq_set($infra_template_scope,infra_seq_right('infra.session.get'),$cl);

		$cl=function(){ return infra_session_getLink(); };
		infra_seq_set($infra_template_scope,infra_seq_right('infra.session.getLink'),$cl);

		$cl=function(){ return infra_session_getTime(); };
		infra_seq_set($infra_template_scope,infra_seq_right('infra.session.getTime'),$cl);

		$cl=function(){ return infra_session_getId(); };
		infra_seq_set($infra_template_scope,infra_seq_right('infra.session.getId'),$cl);

		$cl=function(){ return infra_State_get(); };
		infra_seq_set($infra_template_scope,infra_seq_right('infra.State.get'),$cl);

		$cl=function($mix=null){ return infra_State_getState($mix); };
		infra_seq_set($infra_template_scope,infra_seq_right('infra.State.getState'),$cl);
	});

?>
