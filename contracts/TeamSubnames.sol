// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract TeamSubnames {
    struct Team {
        string subname;
        address creator;
        address [] members;
    }

    Team[] public teams;
    mapping(string => uint256) private teamIndex;

    event TeamCreated(string subname, address creator);
    event MemberAdded(string subname, address member);
    event MemberRemoved(string subname, address member);

    //function to create a new team
    function createTeam(string memory _subname) public {
        require(teamIndex[_subname] == 0, "Team already exists");
        Team memory newTeam = Team(_subname, msg.sender, new address[](0));
        teams.push(newTeam);
        teamIndex[_subname] = teams.length;
        emit TeamCreated(_subname, msg.sender);
    }
    
    //function to add a new member to a team
    function addMember(string memory _subname, address _member) public {
        uint256 index = teamIndex[_subname];
        require(index != 0, "Team does not exist");
        require(teams[index - 1].creator == msg.sender, "Only creator can add members");
        teams[index - 1].members.push(_member);
        emit MemberAdded(_subname, _member);
    }

    //function to remove a member from a team
    function removeMember(string memory _subname, address _member) public {
        uint256 index = teamIndex[_subname];
        require(index != 0, "Team does not exist");
        require(teams[index - 1].creator == msg.sender, "Only creator can remove members");
        address[] storage members = teams[index - 1].members;
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == _member) {
                members[i] = members[members.length - 1];
                members.pop();
                emit MemberRemoved(_subname, _member);
                return;
            }
        }
        revert("Member not found");
    }

    // funtion to get team details by subname
    function getTeam(string memory _subname) public view returns (string memory, address, address[] memory) {
        uint256 index = teamIndex[_subname];
        require(index != 0, "Team does not exist");
        Team memory team = teams[index - 1];
        return (team.subname, team.creator, team.members);
    }
}
