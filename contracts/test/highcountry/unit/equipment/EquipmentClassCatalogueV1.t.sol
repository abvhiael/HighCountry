// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "../../../../src/highcountry/equipment/EquipmentClassCatalogueV1.sol";

contract EquipmentClassCatalogueV1Test {
    EquipmentClassCatalogueV1 internal catalogue = new EquipmentClassCatalogueV1();

    function testAllClassesAndTiersHaveDistinctImmutableDefinitions() public {
        bytes32[10] memory allIds;
        uint256 at;
        for (uint8 equipmentClass = 0; equipmentClass < 5; equipmentClass++) {
            for (uint8 tier = 0; tier < 2; tier++) {
                EquipmentClassCatalogueV1.Definition memory d = catalogue.definition(equipmentClass, tier);
                require(d.version == catalogue.CATALOGUE_VERSION(), "version mismatch");
                require(d.typeId == keccak256(abi.encode("HC.EQUIPMENT.CLASS.V1", equipmentClass, tier)), "type binding");
                require(d.maximum > 0 && d.degradeBelow < d.maximum, "bounded degradation");
                require(d.operatingCost > 0 && d.repairCost > 0 && d.craftParts > 0, "free resource exploit");
                require(d.operatingResource != bytes32(0) && d.repairResource != bytes32(0), "missing resource");
                require(d.craftOutput != bytes32(0) && d.recycleResource != bytes32(0), "missing output");
                for (uint256 j = 0; j < at; j++) require(allIds[j] != d.typeId, "duplicate equipment type");
                allIds[at++] = d.typeId;
            }
        }
        require(at == 10, "incomplete catalogue");
    }

    function testAdvancedTierCostsMoreAndNeverReducesBounds() public {
        for (uint8 equipmentClass = 0; equipmentClass < 5; equipmentClass++) {
            EquipmentClassCatalogueV1.Definition memory basic = catalogue.definition(equipmentClass, 0);
            EquipmentClassCatalogueV1.Definition memory advanced = catalogue.definition(equipmentClass, 1);
            require(basic.slots == 1 && advanced.slots == 2, "slot schedule");
            require(advanced.maximum > basic.maximum && advanced.degradeBelow > basic.degradeBelow, "tier integrity");
            require(advanced.useCost > basic.useCost && advanced.operatingCost > basic.operatingCost, "tier resource inflation");
            require(advanced.repairCost > basic.repairCost && advanced.craftParts > basic.craftParts, "unfunded upgrade");
            require(advanced.repairRestore > basic.repairRestore, "repair schedule");
            require(advanced.operatingResource == basic.operatingResource, "unexpected resource substitution");
            for (uint256 effect = 0; effect < 6; effect++) {
                require(advanced.effects[effect] == basic.effects[effect] * 2, "effect scaling");
            }
        }
    }

    function testInvalidEquipmentClassAndTierRevert() public {
        bool accepted;
        try catalogue.definition(5, 0) returns (EquipmentClassCatalogueV1.Definition memory result) {
            accepted = result.maximum > 0;
        } catch {}
        require(!accepted, "invalid class accepted");
        try catalogue.definition(0, 2) returns (EquipmentClassCatalogueV1.Definition memory result) {
            accepted = result.maximum > 0;
        } catch {}
        require(!accepted, "invalid tier accepted");
        try catalogue.definition(type(uint8).max, type(uint8).max)
            returns (EquipmentClassCatalogueV1.Definition memory result) {
            accepted = result.maximum > 0;
        } catch {}
        require(!accepted, "invalid tuple accepted");
    }

    function testResourceBindingPerClass() public {
        require(catalogue.definition(0, 0).operatingResource == catalogue.POWER_UNITS(), "lighting resource");
        require(catalogue.definition(1, 0).operatingResource == catalogue.POWER_UNITS(), "ventilation resource");
        require(catalogue.definition(2, 0).operatingResource == catalogue.WATER_UNITS(), "irrigation resource");
        require(catalogue.definition(3, 0).operatingResource == catalogue.NUTRIENT_UNITS(), "nutrient resource");
        require(catalogue.definition(4, 0).operatingResource == catalogue.POWER_UNITS(), "climate resource");
    }
}
