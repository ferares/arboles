/********************************************************************************* FUNCIONES GLOBALES */

// Mostrar todas las especies
/*function muestraTodasLasEspecies() {
  $('input#especie_id').val(null);
  $('input#muestra-especie').val(null);

  $("ul#results").fadeOut();
  $('h6#results-text').fadeOut();

  $('input#respecies-todas').prop('checked', true);
}*/

var markers = L.markerClusterGroup({
  chunkedLoading: true,
  chunkProgress: updateProgressBar,
  showCoverageOnHover: true,
  zoomToBoundsOnClick: true,
  spiderfyDistanceMultiplier: 2,
  maxClusterRadius: 100, // en pixeles
  disableClusteringAtZoom: 21,
  polygonOptions: {
    fillColor: '#5cba9d',
    color: '#5cba9d',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.1
   }
});

var markerList = [];

var LeafIcon  = L.Icon.extend({
  options: {
    iconSize:     [30, 34],
    iconAnchor:   [15, 31],
    popupAnchor:  [1, -20]
  }
});

function updateProgressBar(processed, total, elapsed, layersArray) {
  if (elapsed > 1000) {
    // Si toma más de un segundo en cargar, se muestra la barra de progreso.
    $('.progress').slideDown('slow');
    porcentaje = Math.round(processed/total*100) + '%';
    $('.progress-bar').css({'width':porcentaje})
  }

  if (processed === total) {
    // Todos los markers cargados, oculto la barra.
    $('.progress').slideUp('slow');
  }
}

function onMarkerClick(e) {
  var oMarkerId = this.arbolId;

  $.ajax({
    url: 'http://localhost:8080/arboles/' + oMarkerId,
    success: function(arbol) {
      var fecha = new Date(arbol.fecha_creacion);
      fecha = fecha.getDate() + '/' + fecha.getMonth() + '/' + fecha.getFullYear();

      var $detallesArbol = $('<p>').append(
        arbol.tipo,
        $('<br>'),
        'Familia: ' + arbol.familia,
        $('<br>'),
        'Origen: ' + arbol.origen
      );

      if (arbol.procedencia_exotica) {
        $detallesArbol.append(
          $('<br>'),
          'Procedencia: ' + arbol.procedencia_exotica
        );
      }

      if (arbol.region_nea || arbol.region_noa || arbol.region_cuyana || arbol.region_pampeana || arbol.region_patagonica) {
        $detallesArbol.append(
          $('<br>'),
          'Región de origen: '
        );

        var cantidadRegiones = 0;
        if (arbol.region_pampeana) {
          $detallesArbol.append('Pampeana');
          cantidadRegiones++;
        }

        if (arbol.region_nea) {
          if (cantidadRegiones > 0) {
            $detallesArbol.append('/');
          }

          $detallesArbol.append('NEA');
        }

        if (arbol.region_noa) {
          if (cantidadRegiones > 0) {
            $detallesArbol.append('/');
          }

          $detallesArbol.append('NOA');
        }

        if (arbol.region_cuyana) {
          if (cantidadRegiones > 0) {
            $detallesArbol.append('/');
          }

          $detallesArbol.append('Cuyana');
        }

        if (arbol.region_patagonica) {
          if (cantidadRegiones > 0) {
            $detallesArbol.append('/');
          }

          $detallesArbol.append('Patagónica');
        }
      }

      if (arbol.altura) {
        $detallesArbol.append(
          $('<br>'),
          'Altura: ' + arbol.altura + ' m'
        );
      }

      var $ubicacion = $('<p>').append(
        $('<i>', { class: 'fa fa-map-marker fa-fw' })
      );

      if (arbol.espacio_verde) {
        $ubicacion.append('Espacio Verde: ' + arbol.espacio_verde);
      } else {
        if (arbol.calle_altura == 0) {
          arbol.calle_altura = 's/n';
        }

        $ubicacion.append(arbol.calle + ' ' + arbol.calle_altura);
      }

      var $enalces = [];

      if (arbol.url) {
        $enalces.push(
          $('<a>', { target: '_blank', 'href': arbol.url }).append(
            $('<span>', { class: 'fa-stack fa-lg' }).append(
              $('<i>', { class: 'fa fa-circle fa-stack-2x' }),
              $('<i>', { class: 'fa fa-link fa-stack-1x fa-inverse' }),
            )
          )
        );
      }

      if (arbol.facebook) {
        $enalces.push(
          $('<a>', { target: '_blank', 'href': arbol.facebook }).append(
            $('<span>', { class: 'fa-stack fa-lg' }).append(
              $('<i>', { class: 'fa fa-circle fa-stack-2x' }),
              $('<i>', { class: 'fa fa-facebook fa-stack-1x fa-inverse' }),
            )
          )
        );
      }

      if (arbol.instagram) {
        $enalces.push(
          $('<a>', { target: '_blank', 'href': arbol.instagram }).append(
            $('<span>', { class: 'fa-stack fa-lg' }).append(
              $('<i>', { class: 'fa fa-circle fa-stack-2x' }),
              $('<i>', { class: 'fa fa-instagram fa-stack-1x fa-inverse' }),
            )
          )
        );
      }

      if (arbol.twitter) {
        $enalces.push(
          $('<a>', { target: '_blank', 'href': arbol.twitter }).append(
            $('<span>', { class: 'fa-stack fa-lg' }).append(
              $('<i>', { class: 'fa fa-circle fa-stack-2x' }),
              $('<i>', { class: 'fa fa-twitter fa-stack-1x fa-inverse' }),
            )
          )
        );
      }

      var $iframe = $('<iframe>', {
        width: 100,
        height: 400,
        frameborder: 0,
        allowfullscreen: true,
        style: 'width: 100%; height: 400px',
        src: arbol.streetview ? arbol.streetview : 'https://www.google.com/maps/embed/v1/streetview?key=AIzaSyDfB7v0px8LqJ3UXBP4yNZ374KQZVEAZ-Y&location=' + arbol.lat + ',' + arbol.lng + '&heading=210&pitch=10&fov=35',
      });

      var $fichaArbol = $('<div>', { class: 'box' }).append(
        $('<a>', { href: '#', class: 'cerrar' }).append(
          'cerrar',
          $('<i>', { class: 'fa fa-times' })
        ),
        $('<h1>').append(
          arbol.nombre_cientifico,
          $('<br>'),
          $('<small>').append(arbol.nombre_comun)
        ),
        $detallesArbol,
        $ubicacion,
        $('<div>', { class: 'autor panel panel-primary' }).append(
          $('<div>', { class: 'panel-heading' }).append(
            $('<h4>').append('Fuentes')
          ),
          $('<div>', { class: 'panel-body' }).append(
            $('<p>').append(
              'Dato aportado por ',
              $('<strong>').append(arbol.nombre)
            ),
            $('<p>').append(
              $('<small>').append(
                fecha,
                $('<br>'),
                arbol.descripcion
              )
            ),
            $enalces
          )
        ),
        $('<div>', { class: 'panel panel-default' }).append($iframe),
        $('<div>', { class: 'autor panel panel-default' }).append(
          $('<div>', { class: 'panel-heading' }).append(
            $('<h4>').append('Este árbol')
          ),
          $('<div>', { class: 'panel-body' }).append(
            $('<p>').append(
              'El siguiente código sirve para identificar a este árbol: ',
              $('<kbd>').append(arbol.id),
              $('<a>', { target: '_blank', href: '/arbol_id=' + arbol.id }).append( // TODO: URL completa al árbol
                $('<i>', { class: 'fa fa-external-link' })
              )
            ),
            $('<p>').append(
              'Podés usarlo para reportar datos incorrectos enviando el código con los comentarios que quieras hacer por medio de ',
              $('<a>', { class: 'text-primary', target: '_blank', href: 'https://www.facebook.com/arboladomapa/' }).append(
                $('<i>', { class: 'fa fa-facebook-square' }),
                '/arboladomapa',
                $('<br>'),
              ),
              '¡Gracias!'
            )
          )
        )
      );
      $('#info-arbol').html($fichaArbol);
      $('#info-arbol').slideDown();
      $('.cerrar').click(function (event) {
        event.preventDefault();
        $('#info-arbol').slideUp();
      })

    }
  });
}

function getArboles() {
  var $form = $('#busca_arboles');
  $.ajax({
    url: 'http://localhost:8080/arboles',
    method: 'GET',
    data: $form.serialize(),
    success: function(arboles) {
      $('#empieza-busqueda').modal('hide');
      if (arboles.length > 0) {
        for (var arbol of arboles) {
          var marker_icon = new LeafIcon({ iconUrl: '/uploads/' + (arbol.icono ? arbol.icono : 'marker.png') });
          var marker = L.marker([arbol.lat, arbol.lng], { icon: marker_icon }).on('click', onMarkerClick);
          marker.arbolId = arbol.id;
          markerList.push(marker);
        }
        markers.addLayers(markerList);
        // Agrego el layer al mapa
        window.map.addLayer(markers);
        // Centro el mapa.
        window.map.fitBounds(markers.getBounds());
      } else {
        $('#sin-resultados').modal('show');
      }
    },
  });
}

function getEspecies() {
  $.ajax({
    url: 'http://localhost:8080/especies',
    method: 'GET',
    success: function(especies) {
      var $select = $('#especie_id');
      var options = [
        $('<option>', { value: 0 }).append('Todas'),
      ];
      var currentId = $select.data('current');
      for (var especie of especies) {
        var $content = $('<div>').append(
          especie.nombre_cientifico + ' ',
          $('<small>', { class: 'muted text-muted' }).append(especie.nombre_comun)
        );
        options.push($('<option>', {
          value: especie.id,
          selected: currentId == especie.id ? true : false,
          'data-content': $content[0].outerHTML,
        }));
      }

      $select.html(options);
      $select.selectpicker();
    },
  });
}

function muestraTodaLaCiudad() {
  $('input#user_latlng').val(null);
  $('input#rdonde-ciudad').prop('checked', true);

  if (window.new_user_marker) {
    window.map.removeLayer(window.new_user_marker);
    window.map.removeLayer(window.new_user_circle);
    window.new_user_marker = undefined;
    window.new_user_circle = undefined;
  }
}

function muestraPorAca(lat,lng,map,buscar) {
  $('input#rdonde-mapa').prop('checked', true);

  if (lat) {
    // cambiar el valor del lat y lng en el form al hacer click en un punto
    $('input#user_latlng').val(lat+' '+lng);
  }

  if (map) {
    // centrar el mapa al click
    map.panTo(new L.LatLng(lat, lng));
  }

  if (buscar) {
    valida = validarBusqueda();
    if (valida) {
      getArboles();
    } else {
      e.preventDefault();
    }
  }
}

function scrollAnimado(anchorHash){
  // animate
  $('html, body').animate({
    scrollTop: $(anchorHash).offset().top
    }, 300, function(){

    // when done, add hash to url
    // (default click behaviour)
    window.location.hash = anchorHash;
  });
}

function validarBusqueda(){

  /********************************************************************* Constantes */
  var hacerSubmit = false;

  /********************************************************************* Relevamiento de variables */
  //var especieUnaCheck  = $('input#respecies-una').prop('checked');
  //var especieTodasCheck  = $('input#respecies-todas').prop('checked');

  var especieUnaCheck;
  var especieTodasCheck;

  var especieId      = $('select#especie_id').val();

  if (especieId > 0) {
    especieUnaCheck = true;
    especieTodasCheck = false;
  } else {
    especieUnaCheck = false;
    especieTodasCheck = true;
  }

  var especieSaboresCheck  = $('input#user_sabores').prop('checked'); // devuelve true o false

  var dondeMarkerCheck  = $('input#rdonde-mapa').prop('checked');
  var dondeCiudadCheck  = $('input#rdonde-ciudad').prop('checked');
  var dondeLatLng      = $('input#user_latlng').val();

  //alert(especieCheck + ' / ' + especieId + ' / ' + dondeCheck + ' / ' + dondeLatLng);

  /********************************************************************* Análisis */
  if(especieUnaCheck == true) {
    if (especieId > 0) {
      var especieUnaCheckOK = true;
    }
  }

  if(dondeMarkerCheck == true) {
    if (dondeLatLng.length > 1) {
      var dondeMarkerCheckOK = true;
    }
  }

  // Para seguir, se tiene que dar alguna de las 3 condiciones:
  // hay alguna especie -ó- se marcó un sitio -ó- se filtra por frutales)
  if( (especieTodasCheck == false) || (dondeCiudadCheck == false) || (especieSaboresCheck == true) ) {
    var especieOdondeOsaboresCheckOK = true;
  }

  /********************************************************************* Diagnóstico */

  if (especieOdondeOsaboresCheckOK == true) {

    if (especieUnaCheck == true) {
      if (especieUnaCheckOK == true) {
        hacerSubmit = true;
      } else {
        // check en una especie pero no hay id
        $('#respecies-una-modal').modal('show');
        hacerSubmit = false;
      }
    }

    if (dondeMarkerCheck == true) {
      if (dondeMarkerCheckOK == true) {
        hacerSubmit = true;
      } else {
        // ckeck en marker pero no hay latlng
        $('#rdonde-ciudad-modal').modal('show');
        hacerSubmit = false;
      }
    }

    if (especieSaboresCheck == true) {
      hacerSubmit = true;
    }

  } else {
    // no pueden ser todas las especies y toda la ciudad
    $('#respecies-todas-modal').modal('show');
    hacerSubmit = false;
  }

  /********************************************************************* Propuesta */

  if(hacerSubmit == true) {

    // Levanto modal para los ansiosos como yo.
    $('#empieza-busqueda').modal('show');

    // Pasó todas las validaciones, envío el form.
    //$('form#busca_arboles').submit();
    return true;
  } else {
    return false;
  }
}

function muestraBorrarIdEspecie(){
  if( $('#especie_id').val() == 0 ) {
    $('#borrar_especie_id').addClass('hidden');
  }else{
    $('input#user_sabores').prop('checked', false);
    $('#borrar_especie_id').removeClass('hidden');
  }
}

function muestraBorrarOrigen(){
  if (
      ($('#rorigen-nativas').prop('checked') == false)
      &&
      ($('#rorigen-exoticas').prop('checked') == false)
    )
  {
    $('#borrar_origen').addClass('hidden');
  } else {
    $('#borrar_origen').removeClass('hidden');
  }
}


// Start Ready
$(document).ready(function() {

  /********************************************************************************* FUNCIONES */
  // Cargar listado de especies
  getEspecies();

  $('#busca_arboles').on('submit', function(event) {
    event.preventDefault();
    if (validarBusqueda()) {
      getArboles();
    }
  });


  /********************************************************************************* INTERACCIONES */

  // radio button de todas las especies
  $("input#respecies-todas").click(function(e) {
    muestraTodasLasEspecies();
  });

  // radio button de toda la ciudad
  $("a#vaciar-posicion").click(function(e) {
    e.preventDefault();
    muestraTodaLaCiudad();
  });

  $('input[type="radio"]').click(function(){

    if ($(this).attr("name")=="respecie") {
      if( $(this).attr("value")==0 ){
        $("#especies-lista").removeClass().addClass('hide');
      } else {
        $("#especies-lista").removeClass();
      }
    }

    if( $(this).attr("name")=="rdonde" ){
      if( $(this).attr("value") == 0 ) {
        muestraTodaLaCiudad();
      } else {
        scrollAnimado('#mapa');
        muestraPorAca();
      }
    }
  });

  // $('form#busca_arboles').submit(function(e) {
  //   valida = validarBusqueda();
  //   if (valida) {
  //     $('form#busca_arboles').submit();
  //   }else{
  //     e.preventDefault();
  //   }
  // });

  $("nav a.scroll").on('click', function(e) {
    e.preventDefault();
    scrollAnimado(this.hash);
  });

  // Lista de Nombre científico
  $('.selectpicker').selectpicker({
    noneSelectedText: 'No hay selección',
    noneResultsText: 'No hay resultados'
  });

  muestraBorrarIdEspecie();

  $( "#especie_id" ).change(function() {
    muestraBorrarIdEspecie();
  });

  $('#borrar_especie_id').click(function(e){
    e.preventDefault();
    $('#especie_id').selectpicker('val', 0);
  });


  $('input#user_sabores').click(function(){
    if ( $(this).prop('checked') == true ) {
      $('#especie_id').selectpicker('val', 0);
    }
  });

  muestraBorrarOrigen();

  $( "#rorigen-nativas, #rorigen-exoticas" ).change(function() {
    muestraBorrarOrigen();
  });


  $('#borrar_origen').click(function(e){
    e.preventDefault();
    $('#rorigen-nativas, #rorigen-exoticas').prop('checked', false);
    $(this).addClass('hidden');
  });


  $('.mas-filtros').click(function(){
    //alert($('#mas-filtros').css('display'));
    if  (  $('#mas-filtros').css('display') == 'none' ) {
      $('#mas-filtros').slideDown();
      $(this).html('ocultar filtros');
    }else{
      $('#mas-filtros').slideUp();
      $(this).html('mostrar filtros');
    }
  })


});
