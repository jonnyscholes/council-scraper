import * as fs from "fs";

import axios from "axios";
import * as jsdom from "jsdom";
const { JSDOM } = jsdom;
import Queue from "async-parallel-queue";

// Test sites WITH results
// georgesriver.nsw.gov.au

// const openEoiTestCases = [
//   "https://www.nillumbik.vic.gov.au/Explore/Arts-and-culture/Opportunities-for-artists/Expression-of-interest-public-art-mural-project",
// ];

// const nowClosedEOITests = [
//     "'https://www.bawbawshire.vic.gov.au/Things-To-Do/Arts-and-Culture/Expressions-of-Interest-Noojee-Resilience-Art-Project'"
// ]

const WebsitesThatBanUs = [
  "https://www.cardinia.vic.gov.au/", // Hard
  "https://www.basscoast.vic.gov.au", // Hard
];

const stylesheetIssues = ["https://www.swanhill.vic.gov.au/"];

const VIC_WEBSITES = [
  "https://www.boroondara.vic.gov.au/",
  "https://www.casey.vic.gov.au/",
  "https://www.goldenplains.vic.gov.au/",
  "https://www.bendigo.vic.gov.au/",
  "https://www.geelongaustralia.com.au/",
  "https://www.alpineshire.vic.gov.au/",
  "https://www.ararat.vic.gov.au",
  "https://www.ballarat.vic.gov.au/",
  "https://www.bawbawshire.vic.gov.au/Home",
  "https://www.bayside.vic.gov.au/",
  "https://www.benalla.vic.gov.au/Home",
  "https://www.brimbank.vic.gov.au/",
  "https://www.buloke.vic.gov.au/",
  "https://www.campaspe.vic.gov.au/Home",
  "https://www.centralgoldfields.vic.gov.au/Home",
  "https://www.colacotway.vic.gov.au/Home",
  "https://www.corangamite.vic.gov.au/Home",
  "https://www.darebin.vic.gov.au/",
  "https://www.eastgippsland.vic.gov.au/",
  "https://www.frankston.vic.gov.au/Home",
  "https://www.gannawarra.vic.gov.au/Home",
  "https://www.gleneira.vic.gov.au/",
  "https://www.glenelg.vic.gov.au/Home",
  "https://www.greaterdandenong.vic.gov.au/",
  "https://greatershepparton.com.au/",
  "https://www.hepburn.vic.gov.au/Home",
  "https://www.hobsonsbay.vic.gov.au/Home",
  "https://www.hrcc.vic.gov.au/Home",
  "https://www.hume.vic.gov.au/Home",
  "https://www.indigoshire.vic.gov.au/Home",
  "https://www.kingston.vic.gov.au/Home",
  "https://www.latrobe.vic.gov.au/",
  "https://www.loddon.vic.gov.au/Home",
  "https://www.mrsc.vic.gov.au/Home",
  "https://www.manningham.vic.gov.au",
  "https://www.mansfield.vic.gov.au/Home",
  "https://www.maribyrnong.vic.gov.au/Home",
  "https://www.maroondah.vic.gov.au/Home",
  "https://www.melbourne.vic.gov.au/Pages/home.aspx",
  "https://www.melton.vic.gov.au/Home",
  "https://www.merri-bek.vic.gov.au/",
  "https://www.mildura.vic.gov.au/Mildura-Rural-City-Council",
  "https://www.mitchellshire.vic.gov.au/",
  "https://www.moira.vic.gov.au/Home",
  "https://www.monash.vic.gov.au/Home",
  "https://mvcc.vic.gov.au/",
  "https://www.moorabool.vic.gov.au/Home",
  "https://www.mornpen.vic.gov.au/Home",
  "https://www.moyne.vic.gov.au/Home",
  "https://www.murrindindi.vic.gov.au/Home",
  "https://www.nillumbik.vic.gov.au/Home",
  "https://www.ngshire.vic.gov.au/Home",
  "https://www.portphillip.vic.gov.au/",
  "https://www.pyrenees.vic.gov.au/Home",
  "https://www.queenscliffe.vic.gov.au/Home",
  "https://www.southgippsland.vic.gov.au",
  "https://www.sthgrampians.vic.gov.au/page/HomePage.aspx",
  "https://www.stonnington.vic.gov.au/Home",
  "https://www.strathbogie.vic.gov.au/",
  "https://www.surfcoast.vic.gov.au/Home",
  "https://www.towong.vic.gov.au/",
  "https://www.wangaratta.vic.gov.au/Home",
  "https://www.warrnambool.vic.gov.au/",
  "https://www.wellington.vic.gov.au/",
  "https://www.westwimmera.vic.gov.au/Home",
  "https://www.whittlesea.vic.gov.au/",
  "https://www.wodonga.vic.gov.au/",
  "https://www.wyndham.vic.gov.au/",
  "https://www.yarracity.vic.gov.au/",
  "https://www.yarraranges.vic.gov.au/Home",
  "https://www.yarriambiack.vic.gov.au/Home",
];

const NSW_WEBSITES = [
  "http://www.alburycity.nsw.gov.au/",
  "http://www.armidaleregional.nsw.gov.au/",
  "http://www.ballina.nsw.gov.au/",
  "http://www.balranald.nsw.gov.au/",
  "https://www.bathurst.nsw.gov.au/",
  "http://www.bayside.nsw.gov.au/",
  "http://www.begavalley.nsw.gov.au/",
  "http://www.bellingen.nsw.gov.au/",
  "http://www.berriganshire.nsw.gov.au/",
  "http://www.blacktown.nsw.gov.au/",
  "http://www.blandshire.nsw.gov.au/",
  "http://www.blayney.nsw.gov.au/",
  "http://www.bmcc.nsw.gov.au/",
  "http://www.bogan.nsw.gov.au/",
  "http://www.bourke.nsw.gov.au/",
  "http://www.brewarrina.nsw.gov.au/",
  "http://www.brokenhill.nsw.gov.au/",
  "http://www.burwood.nsw.gov.au/",
  "http://www.byron.nsw.gov.au/",
  "http://www.cabonne.nsw.gov.au/",
  "http://www.camden.nsw.gov.au/",
  "http://www.campbelltown.nsw.gov.au/",
  "http://www.carrathool.nsw.gov.au/",
  "https://www.centralcoast.nsw.gov.au/",
  "http://www.centraldarling.nsw.gov.au/",
  "http://www.cessnock.nsw.gov.au/",
  "http://www.canadabay.nsw.gov.au/",
  "https://www.cbcity.nsw.gov.au/",
  "http://www.parracity.nsw.gov.au/",
  "http://www.ryde.nsw.gov.au/",
  "http://www.cityofsydney.nsw.gov.au/",
  "http://www.clarence.nsw.gov.au/",
  "http://www.cobar.nsw.gov.au/",
  "https://www.coffsharbour.nsw.gov.au/Pages/default.aspx",
  "http://www.coolamon.nsw.gov.au/",
  "http://www.coonambleshire.nsw.gov.au/",
  "http://www.cgrc.nsw.gov.au/",
  "http://www.cowracouncil.com.au/",
  "http://www.cumberland.nsw.gov.au/",
  "https://www.dubbo.nsw.gov.au/",
  "http://www.dungog.nsw.gov.au/",
  "http://www.edwardriver.nsw.gov.au/",
  "https://www.esc.nsw.gov.au/",
  "http://www.fairfieldcity.nsw.gov.au/",
  "http://www.corowa.nsw.gov.au/",
  "http://www.forbes.nsw.gov.au/",
  "http://www.georgesriver.nsw.gov.au/Home",
  "http://www.gilgandra.nsw.gov.au/",
  "http://www.gisc.nsw.gov.au/",
  "https://www.goulburn.nsw.gov.au/Home",
  "http://www.greaterhume.nsw.gov.au/",
  "http://www.griffith.nsw.gov.au/",
  "http://www.gunnedah.nsw.gov.au/",
  "http://www.gwydirshire.com/",
  "https://www.hawkesbury.nsw.gov.au/",
  "http://www.hay.nsw.gov.au/",
  "http://hilltops.nsw.gov.au/",
  "http://www.hornsby.nsw.gov.au/",
  "http://www.huntershill.nsw.gov.au/",
  "https://www.innerwest.nsw.gov.au/",
  "http://www.inverell.nsw.gov.au/",
  "http://www.junee.nsw.gov.au/",
  "https://www.kempsey.nsw.gov.au/Home",
  "http://www.kiama.nsw.gov.au/",
  "http://www.kmc.nsw.gov.au/",
  "http://www.kyogle.nsw.gov.au/",
  "http://www.lachlan.nsw.gov.au/",
  "http://www.lakemac.com.au/",
  "http://www.lanecove.nsw.gov.au/",
  "http://www.leeton.nsw.gov.au/",
  "http://www.lismore.nsw.gov.au/",
  "http://www.lithgow.nsw.gov.au/",
  "https://www.liverpool.nsw.gov.au/",
  "https://www.liverpoolplains.nsw.gov.au/Home",
  "http://www.lockhart.nsw.gov.au/",
  "http://www.maitland.nsw.gov.au/",
  "http://www.midcoast.nsw.gov.au/Home",
  "https://www.midwestern.nsw.gov.au/Home",
  "https://www.mpsc.nsw.gov.au/",
  "http://www.mosman.nsw.gov.au/",
  "http://www.murrayriver.nsw.gov.au/",
  "http://www.murrumbidgee.nsw.gov.au/",
  "http://www.muswellbrook.nsw.gov.au/",
  "http://www.nambucca.nsw.gov.au/",
  "http://www.narrabri.nsw.gov.au/",
  "http://www.narrandera.nsw.gov.au/",
  "http://www.narromine.nsw.gov.au/",
  "http://www.ncc.nsw.gov.au/",
  "http://www.northsydney.nsw.gov.au/",
  "http://www.northernbeaches.nsw.gov.au/",
  "https://www.oberon.nsw.gov.au/",
  "http://www.orange.nsw.gov.au/",
  "http://www.parkes.nsw.gov.au/",
  "http://www.penrithcity.nsw.gov.au/",
  "http://www.pmhc.nsw.gov.au/",
  "http://www.portstephens.nsw.gov.au/",
  "http://www.qprc.nsw.gov.au/",
  "http://www.randwick.nsw.gov.au/",
  "http://www.richmondvalley.nsw.gov.au/",
  "http://www.shellharbour.nsw.gov.au/",
  "http://www.shoalhaven.nsw.gov.au/",
  "http://www.singleton.nsw.gov.au/",
  "https://www.snowymonaro.nsw.gov.au/",
  "http://www.snowyvalleys.nsw.gov.au/",
  "https://www.strathfield.nsw.gov.au/",
  "https://www.sutherlandshire.nsw.gov.au/",
  "http://www.tamworth.nsw.gov.au/",
  "http://www.temora.nsw.gov.au/",
  "http://www.tenterfield.nsw.gov.au/",
  "http://www.thehills.nsw.gov.au/Home",
  "http://www.tweed.nsw.gov.au/",
  "http://www.upperlachlan.nsw.gov.au/",
  "http://upperhunter.nsw.gov.au/",
  "http://www.uralla.nsw.gov.au/",
  "https://wagga.nsw.gov.au/",
  "http://www.walcha.nsw.gov.au/",
  "http://www.walgett.nsw.gov.au/",
  "http://www.warren.nsw.gov.au/",
  "http://www.warrumbungle.nsw.gov.au/",
  "http://www.waverley.nsw.gov.au/",
  "http://www.weddin.nsw.gov.au/",
  "http://www.wentworth.nsw.gov.au/",
  "http://www.willoughby.nsw.gov.au/",
  "http://www.wsc.nsw.gov.au/",
  "http://www.wollondilly.nsw.gov.au/",
  "http://www.wollongong.nsw.gov.au/",
  "http://www.woollahra.nsw.gov.au/",
  "http://www.yassvalley.nsw.gov.au/",
];

const SA_WEBSITES = [
  "https://www.cityofadelaide.com.au/about-council/your-council/elections/",
  "http://www.ahc.sa.gov.au/",
  "http://www.mallala.sa.gov.au/",
  "http://www.alexandrina.sa.gov.au/",
  "http://www.barossa.sa.gov.au/",
  "http://www.barungawest.sa.gov.au/",
  "http://www.berribarmera.sa.gov.au/",
  "http://www.burnside.sa.gov.au/",
  "http://www.campbelltown.sa.gov.au/",
  "http://www.ceduna.sa.gov.au/",
  "http://www.charlessturt.sa.gov.au/",
  "http://www.claregilbertvalleys.sa.gov.au/",
  "http://www.cleve.sa.gov.au/",
  "http://www.cooberpedy.sa.gov.au/",
  "http://www.coorong.sa.gov.au/",
  "http://www.coppercoast.sa.gov.au/",
  "http://www.elliston.sa.gov.au/",
  "http://www.frc.sa.gov.au/",
  "http://www.franklinharbour.sa.gov.au/",
  "http://www.gawler.sa.gov.au/",
  "http://www.goyder.sa.gov.au/",
  "http://www.dcgrant.sa.gov.au/",
  "http://www.holdfast.sa.gov.au/",
  "http://www.kangarooisland.sa.gov.au/",
  "http://www.dckem.sa.gov.au/",
  "http://www.kimba.sa.gov.au/",
  "http://www.kingstondc.sa.gov.au/",
  "http://www.light.sa.gov.au/",
  "http://www.lowereyrepeninsula.sa.gov.au",
  "http://www.loxtonwaikerie.sa.gov.au/",
  "http://www.marion.sa.gov.au/",
  "http://www.mid-murray.sa.gov.au/",
  "http://www.mitchamcouncil.sa.gov.au/",
  "https://www.mountbarker.sa.gov.au/",
  "http://www.mountgambier.sa.gov.au/",
  "http://www.mtr.sa.gov.au/",
  "http://www.murraybridge.sa.gov.au/",
  "http://www.naracoortelucindale.sa.gov.au/",
  "http://www.nacouncil.sa.gov.au/",
  "http://www.npsp.sa.gov.au/",
  "http://www.onkaparingacity.com/",
  "http://www.orroroo.sa.gov.au/",
  "http://www.peterborough.sa.gov.au/",
  "http://www.playford.sa.gov.au/",
  "https://www.cityofpae.sa.gov.au/",
  "http://www.portaugusta.sa.gov.au/",
  "http://www.portlincoln.sa.gov.au/",
  "http://www.pirie.sa.gov.au/",
  "http://www.prospect.sa.gov.au/",
  "http://www.renmarkparinga.sa.gov.au/",
  "https://www.robe.sa.gov.au/council",
  "http://www.roxbydowns.com/",
  "http://www.salisbury.sa.gov.au/",
  "http://www.southernmallee.sa.gov.au/",
  "http://www.streakybay.sa.gov.au/",
  "http://www.tatiara.sa.gov.au/",
  "http://www.teatreegully.sa.gov.au/",
  "http://www.tumbybay.sa.gov.au/",
  "http://www.unley.sa.gov.au/",
  "http://www.victor.sa.gov.au/",
  "https://www.wrc.sa.gov.au/",
  "http://www.walkerville.sa.gov.au/",
  "http://www.wattlerange.sa.gov.au/",
  "http://www.westtorrens.sa.gov.au/",
  "http://www.whyalla.sa.gov.au/",
  "http://www.wudinna.sa.gov.au/",
  "http://www.yankalilla.sa.gov.au/",
  "http://www.yorke.sa.gov.au/",
];

const WA_WEBSITES = [
  "www.albany.wa.gov.au",
  "www.armadale.wa.gov.au",
  "www.ashburton.wa.gov.au",
  "www.amrshire.wa.gov.au",
  "www.bassendean.wa.gov.au",
  "www.bayswater.wa.gov.au",
  "www.belmont.wa.gov.au",
  "www.beverley.wa.gov.au",
  "www.boddington.wa.gov.au",
  "www.boyupbrook.wa.gov.au",
  "www.bridgetown.wa.gov.au",
  "www.brookton.wa.gov.au",
  "www.broome.wa.gov.au",
  "www.shirebt.wa.gov.au",
  "www.brucerock.wa.gov.au",
  "www.bunbury.wa.gov.au",
  "www.busselton.wa.gov.au",
  "www.cambridge.wa.gov.au",
  "www.canning.wa.gov.au",
  "www.capel.wa.gov.au",
  "www.carnamah.wa.gov.au",
  "www.carnarvon.wa.gov.au",
  "www.chapmanvalley.wa.gov.au",
  "www.chittering.wa.gov.au",
  "www.shire.gov.cx",
  "www.claremont.wa.gov.au",
  "www.cockburn.wa.gov.au",
  "www.shire.cc/en",
  "www.collie.wa.gov.au",
  "www.coolgardie.wa.gov.au",
  "www.coorow.wa.gov.au",
  "www.corrigin.wa.gov.au",
  "www.cottesloe.wa.gov.au",
  "www.cranbrook.wa.gov.au",
  "www.cuballing.wa.gov.au",
  "www.cue.wa.gov.au",
  "www.cunderdin.wa.gov.au",
  "www.dalwallinu.wa.gov.au",
  "www.dandaragan.wa.gov.au",
  "www.dardanup.wa.gov.au",
  "www.denmark.wa.gov.au",
  "www.sdwk.wa.gov.au",
  "www.donnybrook-balingup.wa.gov.au",
  "www.dowerin.wa.gov.au",
  "www.dumbleyung.wa.gov.au",
  "www.dundas.wa.gov.au",
  "www.eastfremantle.wa.gov.au",
  "www.eastpilbara.wa.gov.au",
  "www.esperance.wa.gov.au",
  "www.exmouth.wa.gov.au",
  "www.fremantle.wa.gov.au",
  "www.gingin.wa.gov.au",
  "www.gnowangerup.wa.gov.au",
  "www.goomalling.wa.gov.au",
  "www.gosnells.wa.gov.au",
  "www.cgg.wa.gov.au",
  "www.hallscreek.wa.gov.au",
  "www.harvey.wa.gov.au",
  "www.irwin.wa.gov.au",
  "www.jerramungup.wa.gov.au",
  "www.joondalup.wa.gov.au",
  "www.kalamunda.wa.gov.au",
  "www.ckb.wa.gov.au",
  "www.karratha.wa.gov.au",
  "www.katanning.wa.gov.au",
  "www.kellerberrin.wa.gov.au",
  "www.kent.wa.gov.au",
  "www.kojonup.wa.gov.au",
  "www.kondinin.wa.gov.au",
  "www.koorda.wa.gov.au",
  "www.kulin.wa.gov.au",
  "www.kwinana.wa.gov.au",
  "www.lakegrace.wa.gov.au",
  "www.laverton.wa.gov.au",
  "www.leonora.wa.gov.au",
  "www.mandurah.wa.gov.au",
  "www.manjimup.wa.gov.au",
  "www.meekashire.wa.gov.au",
  "www.melvillecity.wa.gov.au",
  "www.menzies.wa.gov.au",
  "www.merredin.wa.gov.au",
  "www.mingenew.wa.gov.au",
  "www.moora.wa.gov.au",
  "www.morawa.wa.gov.au",
  "www.mosmanpark.wa.gov.au",
  "www.mtmagnet.wa.gov.au",
  "www.mtmarshall.wa.gov.au",
  "www.mukinbudin.wa.gov.au",
  "www.mundaring.wa.gov.au",
  "www.murchison.wa.gov.au",
  "www.murray.wa.gov.au",
  "www.nannup.wa.gov.au",
  "www.narembeen.wa.gov.au",
  "www.narrogin.wa.gov.au",
  "www.nedlands.wa.gov.au",
  "www.ngaanyatjarraku.wa.gov.au",
  "www.northam.wa.gov.au",
  "www.northampton.wa.gov.au",
  "www.nungarin.wa.gov.au",
  "www.peppermintgrove.wa.gov.au",
  "www.perenjori.wa.gov.au",
  "www.perth.wa.gov.au",
  "www.pingelly.wa.gov.au",
  "www.plantagenet.wa.gov.au",
  "www.porthedland.wa.gov.au",
  "www.quairading.wa.gov.au",
  "www.ravensthorpe.wa.gov.au",
  "www.rockingham.wa.gov.au",
  "www.sandstone.wa.gov.au",
  "www.sjshire.wa.gov.au",
  "www.sharkbay.wa.gov.au",
  "www.southperth.wa.gov.au",
  "www.stirling.wa.gov.au",
  "www.subiaco.wa.gov.au",
  "www.swan.wa.gov.au",
  "www.tammin.wa.gov.au",
  "www.threesprings.wa.gov.au",
  "www.toodyay.wa.gov.au",
  "www.trayning.wa.gov.au",
  "www.uppergascoyne.wa.gov.au",
  "www.victoriapark.wa.gov.au",
  "www.victoriaplains.wa.gov.au",
  "www.vincent.wa.gov.au",
  "www.wagin.wa.gov.au",
  "www.wandering.wa.gov.au",
  "www.wanneroo.wa.gov.au",
  "www.waroona.wa.gov.au",
  "www.westarthur.wa.gov.au",
  "www.westonia.wa.gov.au",
  "www.wickepin.wa.gov.au",
  "www.williams.wa.gov.au",
  "www.wiluna.wa.gov.au",
  "www.wongan.wa.gov.au",
  "www.woodanilling.wa.gov.au",
  "www.wyalkatchem.wa.gov.au",
  "www.swek.wa.gov.au",
  "www.yalgoo.wa.gov.au",
  "www.yilgarn.wa.gov.au",
  "www.york.wa.gov.au",
];

const QLD_WEBSITES = [
  "http://www.aurukun.qld.gov.au",
  "https://www.balonne.qld.gov.au",
  "https://www.banana.qld.gov.au/",
  "https://www.barcaldinerc.qld.gov.au",
  "https://www.barcoo.qld.gov.au",
  "http://www.btrc.qld.gov.au",
  "https://www.boulia.qld.gov.au",
  "https://www.brisbane.qld.gov.au",
  "https://www.bulloo.qld.gov.au",
  "http://www.bundaberg.qld.gov.au",
  "https://www.burdekin.qld.gov.au",
  "https://www.burke.qld.gov.au",
  "http://www.cairns.qld.gov.au",
  "http://www.carpentaria.qld.gov.au",
  "http://www.cassowarycoast.qld.gov.au",
  "http://beprepared.chrc.qld.gov.au",
  "http://www.getready.ctrc.qld.gov.au",
  "https://cherbourg.qld.gov.au",
  "https://www.cloncurry.qld.gov.au",
  "http://www.cook.qld.gov.au",
  "https://www.croydon.qld.gov.au",
  "https://www.diamantina.qld.gov.au",
  "https://www.doomadgee.qld.gov.au",
  "http://www.douglas.qld.gov.au",
  "https://www.etheridge.qld.gov.au",
  "https://www.flinders.qld.gov.au/",
  "http://www.frasercoast.qld.gov.au",
  "https://www.gladstone.qld.gov.au",
  "http://www.cityofgoldcoast.com.au/",
  "https://www.grc.qld.gov.au",
  "http://www.gympie.qld.gov.au",
  "http://www.hinchinbrook.qld.gov.au",
  "https://www.hopevale.qld.gov.au",
  "http://emd.ipswich.qld.gov.au",
  "https://www.isaac.qld.gov.au",
  "https://www.kowanyama.qld.gov.au",
  "http://www.livingstone.qld.gov.au",
  "https://lockhart.qld.gov.au",
  "https://www.lvrc.qld.gov.au",
  "https://www.logan.qld.gov.au",
  "https://www.longreach.qld.gov.au",
  "http://www.mackay.qld.gov.au",
  "https://www.mapoon.qld.gov.au",
  "http://www.maranoa.qld.gov.au",
  "http://emergency.msc.qld.gov.au",
  "http://www.mckinlay.qld.gov.au",
  "https://www.moretonbay.qld.gov.au",
  "https://www.mornington.qld.gov.au",
  "https://www.mountisa.qld.gov.au",
  "https://www.murweh.qld.gov.au/",
  "http://www.napranum.qld.gov.au",
  "http://www.noosa.qld.gov.au",
  "https://www.northburnett.qld.gov.au",
  "https://www.nparc.qld.gov.au",
  "https://www.palmcouncil.qld.gov.au",
  "https://www.paroo.qld.gov.au",
  "https://www.pormpuraaw.qld.gov.au",
  "http://www.quilpie.qld.gov.au",
  "https://www.redland.qld.gov.au",
  "https://www.richmond.qld.gov.au",
  "https://rockhamptonregion.qld.gov.au",
  "http://www.scenicrim.qld.gov.au",
  "http://www.somerset.qld.gov.au",
  "http://www.southburnett.qld.gov.au",
  "http://www.sdrc.qld.gov.au",
  "https://www.sunshinecoast.qld.gov.au",
  "http://www.trc.qld.gov.au",
  "http://www.tr.qld.gov.au",
  "https://www.torres.qld.gov.au",
  "http://www.tsirc.qld.gov.au",
  "http://www.townsville.qld.gov.au",
  "https://www.weipatownauthority.com.au/",
  "https://www.wdrc.qld.gov.au",
  "http://www.whitsundayrc.qld.gov.au",
  "https://www.winton.qld.gov.au",
  "https://www.woorabinda.qld.gov.au",
  "https://www.wujalwujalcouncil.qld.gov.au",
  "https://www.yarrabah.qld.gov.au/",
];

const TAS_WEBSITES = [
  "http://www.bodc.tas.gov.au",
  "http://www.brighton.tas.gov.au",
  "http://www.centralcoast.tas.gov.au",
  "http://www.centralhighlands.tas.gov.au",
  "http://www.circularhead.tas.gov.au",
  "http://www.ccc.tas.gov.au",
  "http://www.derwentvalley.tas.gov.au",
  "http://www.devonport.tas.gov.au",
  "http://www.dorset.tas.gov.au",
  "http://www.flinders.tas.gov.au",
  "http://www.georgetown.tas.gov.au",
  "http://www.gsbc.tas.gov.au",
  "http://www.gcc.tas.gov.au",
  "http://www.hobartcity.com.au",
  "http://www.huonvalley.tas.gov.au",
  "http://www.kentish.tas.gov.au",
  "http://www.kingborough.tas.gov.au",
  "http://www.kingisland.tas.gov.au",
  "http://www.latrobe.tas.gov.au",
  "http://www.launceston.tas.gov.au",
  "http://www.meandervalley.tas.gov.au",
  "http://www.northernmidlands.tas.gov.au",
  "http://www.sorell.tas.gov.au",
  "http://www.southernmidlands.tas.gov.au",
  "http://www.tasman.tas.gov.au",
  "http://www.warwyn.tas.gov.au",
  "http://www.westcoast.tas.gov.au",
  "http://www.wtc.tas.gov.au",
  "http://www.lgat.tas.gov.au",
];

// TODO: Share vars between client/scraper
const WORDS = {
  positive: [
    "public art",
    "street art",
    "graffiti",
    "exterior",
    "commission",
    "mural",
    "EOI",
    /expressions? of interest/g,
    /calls? for artists?/g,
  ],
  negative: [
    "report graffiti",
    "illegal",
    "police",
    "sculpture",
    "closed",
    "anti-graffiti",
  ],
};

const publicArtWebsites = ["https://www.creativeballarat.com.au/"];

function scorePage(dom) {
  let score = 0;
  const foundNegatives = [];
  const foundPositives = [];

  dom.window.document
    .querySelectorAll(
      '[role="navigation"], [class*="nav" i], [class*="menu" i], nav, script'
    )
    .forEach((el) => el.remove());

  let mainContent = dom.window.document
    .querySelector("body")
    .innerHTML.toLowerCase();

  WORDS.positive.forEach((k) => {
    if (mainContent.match(k) !== null) {
      score++;
      foundPositives.push(k.toString());
    }
  });
  // WORDS.negative.forEach((k) => {
  //   if (mainContent.match(k) !== null) {
  //     score--;
  //     foundNegatives.push(k.toString());
  //   }
  // });

  return { score, matches: { foundNegatives, foundPositives } };
}

function isSameBaseUrl(url1, url2) {
  const getBaseUrl = (url) => {
    try {
      return new URL(url).origin;
    } catch (e) {
      return false;
    }
  };

  return getBaseUrl(url1) === getBaseUrl(url2);
}

function isRelativeUrl(url) {
  return url.startsWith("/");
}

function notProtocolUrl(url) {
  return !url.startsWith("//");
}

function notFileUrl(url) {
  const bannedExtensions = [
    ".pdf",
    ".rtf",
    ".txt",
    ".jpg",
    ".jpeg",
    ".docx",
    ".doc",
    ".png",
    ".mp3",
    ".mp4",
    ".mov",
  ];
  return !bannedExtensions.some((extension) =>
    url.toLowerCase().includes(extension)
  );
}

function notBannedUrlFragment(url) {
  const bannedUrlStrings = [
    "map",
    "book",
    "support-services",
    "archive",
    "pagination",
    "lang=",
    "cgi",
    "/Files/",
    "/files/",
    "_flysystem",
    "/downloads/",
    "/download/",
    "umbraco",
    "au/link/",
    "download?inline",
    "ePathway",
    "login",
    "events",
    "edocman",
    "news",
  ];
  return !bannedUrlStrings.some((s) => url.toLowerCase().includes(s));
}

async function scrapeAndScore(url) {
  console.log(`Scraping ${url}`);
  try {
    const { data } = await axios.get(url, {
      maxContentLength: 2 * 1000 * 1000, // in bytes
      maxRedirects: 2,
      timeout: 10 * 1000, // miliseconds
    });

    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.on("error", () => {
      // No-op to skip console errors.
    });

    const dom = new JSDOM(data, {
      url,
      virtualConsole,
    });

    const { score, matches } = scorePage(dom);

    if (score > 0) {
      console.log(`Match Found for: ${url}`);
    }

    const links = dom.window.document.querySelectorAll("a");
    const title = dom.window.document.title;

    return {
      error: false,
      match: score > 0,
      matches,
      links,
      title,
    };
  } catch (error) {
    console.log(`Error scraping ${url}: `, error.message);
    let reason = "generic";

    if (error.message.indexOf("ETIMEDOUT") !== -1) {
      reason = "timeout";
    }

    return {
      error: true,
      reason,
    };
  }
}

async function scrapeWebsite(targetUrl, baseUrl, state) {
  const pagesWithKeyword = [];
  const visitedUrls = new Set();
  const pageQueue = new Queue({ concurrency: 20 });
  const maxTimeouts = 5;
  let numTimeouts = 0;

  const scrapePage = async (url, baseUrl) => {
    if (visitedUrls.has(url)) return;
    visitedUrls.add(url);

    const res = await scrapeAndScore(url);

    if (!res) {
      return;
    }

    if (res.error) {
      if (res.reason === "timeout") {
        numTimeouts++;
      }
      return;
    }

    if (res.match) {
      pagesWithKeyword.push({ url, matches: res.matches, title: res.title });
    }

    if (res.links.length > 0 && numTimeouts <= maxTimeouts) {
      res.links.forEach((link) => {
        let href = link.getAttribute("href");

        if (href === null) {
          return;
        }

        if (href.startsWith("/www.")) {
          href = href.replace("/www.", "www.");
        }

        if (href.indexOf("#") !== -1) {
          const bits = href.split("#");
          href = bits[0];
        }

        if (
          (isSameBaseUrl(href, baseUrl) || isRelativeUrl(href)) &&
          notProtocolUrl(href) &&
          notFileUrl(href) &&
          notBannedUrlFragment(href)
        ) {
          let absoluteUrl = href;

          if (isRelativeUrl(href)) {
            absoluteUrl = new URL(href, baseUrl).href;
          }

          if (!visitedUrls.has(absoluteUrl)) {
            pageQueue.add(scrapePage, { args: [absoluteUrl, baseUrl] });
          }
        }
      });
    } else if (numTimeouts > maxTimeouts) {
      console.log(`Too many timeouts for ${url}. Abandoning.`);
    }
  };

  pageQueue.add(scrapePage, { args: [targetUrl, baseUrl] });

  await pageQueue.waitIdle();

  // console.log(pagesWithKeyword, Array.from(visitedUrls).length);
  // return { pagesWithKeyword, visitedUrls: Array.from(visitedUrls) };
  return { pagesWithKeyword, baseUrl, state };
}

const allLinks = [];
NSW_WEBSITES.forEach((url) => {
  allLinks.push({ url, state: "NSW" });
});
VIC_WEBSITES.forEach((url) => {
  allLinks.push({ url, state: "VIC" });
});
SA_WEBSITES.forEach((url) => {
  allLinks.push({ url, state: "SA" });
});
WA_WEBSITES.forEach((url) => {
  allLinks.push({ url, state: "WA" });
});
TAS_WEBSITES.forEach((url) => {
  allLinks.push({ url, state: "TAS" });
});
QLD_WEBSITES.forEach((url) => {
  allLinks.push({ url, state: "QLD" });
});

const smallTest = [
  { url: "https://www.nillumbik.vic.gov.au/", state: "VIC" },
  { url: "https://www.georgesriver.nsw.gov.au/", state: "NSW" },
];

console.log(allLinks.length);

console.time("scraping");
const queue = new Queue({ concurrency: 5 });
const data = await Promise.all(
  allLinks.map((council) =>
    queue.add(scrapeWebsite, {
      args: [council.url, council.url, council.state],
    })
  )
);

await queue.waitIdle();
console.timeEnd("scraping");

const fname = `data-${Date.now()}.json`;
fs.writeFile(fname, JSON.stringify(data, null, 2), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`${fname} written!`);
  }
});
