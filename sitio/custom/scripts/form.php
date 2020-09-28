<form action="<?php echo $APP_URL; ?>/index.php#mapa" method="post" id="busca_arboles">
  <div class="row">
    <div class="col-xs-12">
      <div class="form-group">
        <h3>¿Dónde?</h3>
        <div class="radio">
          <label>
            <input type="radio" id="rdonde-ciudad" name="rdonde" value="0" <?php echo (stripos($busqueda, 'marker') == 0) ? 'checked' : '' ?>>
            en todo el mapa
          </label>
          <label>
            <input type="radio" id="rdonde-mapa" name="rdonde" value="<? echo $user_latlng_default[0].' '.$user_latlng_default[1] ?>" <?php echo (stripos($busqueda, 'marker') > 0) ? 'checked' : '' ?>>
            marcar en el mapa
          </label>
        </div>
        <input type="hidden" value="<?php echo (isset($user_lat) && isset($user_lng)) ? $user_lat.' '.$user_lng : '' ?>" name="user_latlng" id="user_latlng">
      </div>
    </div>

    <div class="col-xs-12">
      <div class="form-group">
        <h3 class="pull-left">
          ¿Qué especie?
          <a href="#" id="borrar_especie_id">
            <i class="fa fa-trash-o"></i>
          </a>
        </h3>
        <select class="form-control input-lg" data-style="btn-default" name="especie_id" id="especie_id" data-live-search="true" data-current="<?php echo $especie_id_busqueda ?>">
        </select>
      </div>
    </div>

    <div class="col-xs-12 <?php echo $masFiltrosCss; ?>" id="mas-filtros">
      <div class="form-group">
        <h3>Sabores</h3>
        <label for="user_sabores">
          <input type="checkbox" name="user_sabores" id="user_sabores" value="1" <?php echo ((isset($user_sabores)) && ($user_sabores > 0)) ? 'checked' : '' ?>>
          frutales y medicinales <!-- <span class="label label-warning">beta</span> -->
        </label>
      </div>

      <div class="form-group">
        <h3>Origen</h3>
        <div class="radio">
          <label>
            <input type="radio" id="rorigen-nativas" name="user_origen" value="Nativo/Autóctono" <?php echo (stripos($busqueda, 'Nativo') > 0) ? 'checked' : '' ?>>
            nativas
          </label>
          <label>
            <input type="radio" id="rorigen-exoticas" name="user_origen" value="Exótico" <?php echo (stripos($busqueda, 'Exótico') > 0) ? 'checked' : '' ?>>
            exóticas
          </label>
          <a href="#" id="borrar_origen">
            <i class="fa fa-trash-o"></i>
          </a>
        </div>

        <div class="regiones">
          <h3>Región de origen</h3>
          <label for="borigen_pampeana"> <input type="checkbox" name="borigen_pampeana" id="borigen_pampeana" value="1" <?php echo ($borigen_pampeana > 0) ? 'checked' : '' ?>>
            Pampeana
          </label>
          <label for="borigen_nea"> <input type="checkbox" name="borigen_nea" id="borigen_nea" value="1"  <?php echo ($borigen_nea > 0) ? 'checked' : '' ?>>
            NEA
          </label>
          <label for="borigen_noa"> <input type="checkbox" name="borigen_noa" id="borigen_noa" value="1"  <?php echo ($borigen_noa > 0) ? 'checked' : '' ?>>
            NOA
          </label>
          <label for="borigen_cuyana"> <input type="checkbox" name="borigen_cuyana" id="borigen_cuyana" value="1"  <?php echo ($borigen_cuyana > 0) ? 'checked' : '' ?>>
            Cuyana
          </label>
          <label for="borigen_patagonica"> <input type="checkbox" name="borigen_patagonica" id="borigen_patagonica" value="1"  <?php echo ($borigen_patagonica > 0) ? 'checked' : '' ?>>
            Patagónica
          </label>
        </div>
      </div>
    </div>
    <div class="col-xs-12" id="mas-filtros-btn-container">
      <a href="#" class="btn btn-default mas-filtros">
        <?php echo ($masFiltrosCss == 'oculto') ? "mostrar" : "ocultar" ?> filtros
      </a>
    </div>
  </div>
  <input name="Buscar" type="submit" value="Buscar" class="btn btn-primary btn-lg btn-block">
</form>
